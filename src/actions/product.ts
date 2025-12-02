"use server";

import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { s3Client, AWS_S3_BUCKET } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export type Product = {
   id: number;
    nombre: string;
    descripcion: string;
    altura: number | null;
    largo: number | null;
    ancho: number | null;
    peso: number | null;
    precio: number;
    inventario: number;
    color: string;
    marca: string;
    real_status:   "activo" | "inactivo" | "agotado" | "pausado" | null;
    slug: string;
    vendedor: string;
    estado: boolean;
    vendidos: number;
    sku: string;
    idPerfil: number | null;
    id_category: number | null;
    sellerId: number | null;
    pedidoProductosCount?: number;
    images: {
        id: number;
        url: string;
        orden: number;
    }[];
};

export async function updateProduct(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = parseFloat(formData.get("precio") as string);
  const inventario = parseInt(formData.get("inventario") as string);
  const marca = formData.get("marca") as string;
  const color = formData.get("color") as string;
  const sku = formData.get("sku") as string;
  const idCategoryStr = formData.get("id_category") as string;
  const idCategory = idCategoryStr ? parseInt(idCategoryStr) : null;
  const real_status = formData.get("real_status") as "activo" | "inactivo" | "agotado" | "pausado" | null;

  // Verify ownership
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct || existingProduct.sellerId !== Number(session.user.id)) {
    throw new Error("Unauthorized or product not found");
  }

  await prisma.product.update({
    where: { id },
    data: {
      nombre,
      descripcion,
      precio,
      inventario,
      marca,
      color,
      sku,
      id_category: idCategory,
      real_status: real_status,
    },
  });

  // Handle deleted images
  const deletedImageIds = formData.getAll("deletedImageIds").map(id => Number(id));
  if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.productImage.findMany({
          where: {
              id: { in: deletedImageIds },
              productId: id 
          }
      });

      for (const image of imagesToDelete) {
          const key = image.url.split("/").pop();
          if (key) {
              try {
                  await s3Client.send(new DeleteObjectCommand({
                      Bucket: AWS_S3_BUCKET,
                      Key: key
                  }));
              } catch (e) {
                  console.error("Error deleting from S3", e);
              }
          }
      }

      await prisma.productImage.deleteMany({
          where: {
              id: { in: deletedImageIds }
          }
      });
  }

  // Handle image reordering
  const imageOrderStr = formData.get("imageOrder") as string;
  if (imageOrderStr) {
      const imageOrder = JSON.parse(imageOrderStr) as { id: number, orden: number }[];
      for (const item of imageOrder) {
          // Verify image belongs to product to prevent unauthorized updates
          const img = await prisma.productImage.findFirst({ where: { id: item.id, productId: id }});
          if (img) {
             await prisma.productImage.update({
                where: { id: item.id },
                data: { orden: item.orden }
            });
          }
      }
  }

  const images = formData.getAll("images") as File[];

  if (images && images.length > 0) {
    const imageData = [];

    for (let index = 0; index < images.length; index++) {
      const file = images[index];
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${existingProduct.slug}-${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const url = process.env.NEXT_PUBLIC_R2_DOMAIN 
        ? `${process.env.NEXT_PUBLIC_R2_DOMAIN}/${fileName}`
        : `${process.env.AWS_S3_ENDPOINT}/${AWS_S3_BUCKET}/${fileName}`;

      imageData.push({
        url: url,
        orden: index,
        productId: id,
      });
    }

    if (imageData.length > 0) {
      await prisma.productImage.createMany({
        data: imageData,
      });
    }
  }
}

export async function deleteProduct(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existingProduct || existingProduct.sellerId !== Number(session.user.id)) {
    throw new Error("Unauthorized or product not found");
  }

  // Delete images from S3
  for (const image of existingProduct.images) {
    const key = image.url.split("/").pop();
    if (key) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET,
            Key: key,
          })
        );
      } catch (error) {
        console.error(`Failed to delete image ${key} from S3`, error);
      }
    }
  }

  await prisma.product.delete({
    where: { id },
  });
}

export async function deleteProductImage(imageId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: true },
  });

  if (!image || image.product.sellerId !== Number(session.user.id)) {
    throw new Error("Unauthorized or image not found");
  }

  // Delete from S3
  const key = image.url.split("/").pop();
  if (key) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: key,
        })
      );
    } catch (error) {
      console.error(`Failed to delete image ${key} from S3`, error);
    }
  }

  await prisma.productImage.delete({
    where: { id: imageId },
  });
}

export async function updateImageOrder(imageId: number, newOrder: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: true },
  });

  if (!image || image.product.sellerId !== Number(session.user.id)) {
    throw new Error("Unauthorized or image not found");
  }

  await prisma.productImage.update({
    where: { id: imageId },
    data: { orden: newOrder },
  });
}

export async function getUniqueBrands() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }
  const brands = await prisma.product.findMany({
    where: {
      sellerId: Number(session.user.id),
    },
    select: {
      marca: true,
    },
    distinct: ['marca'],
  });
  return brands.map((b) => b.marca).filter((brand) => brand !== null && brand !== "");
}

export async function getProducts({
  page,
  pageSize = 5,
  search = "",
  brand = "",
  status = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  brand?: string;
  status?: string;
}): Promise<{ products: Product[]; totalPages: number }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { products: [], totalPages: 0 };
  }

  const where: any = {
    sellerId: Number(session.user.id),
  };

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (brand && brand !== "all") {
    where.marca = brand;
  }

  if (status && status !== "all") {
    if (status === "active") {
      where.estado = true;
    } else if (status === "inactive") {
      where.estado = false;
    }
  }

  const totalPages = await prisma.product.count({
    where,
  });

  const products = await prisma.product.findMany({
    where,
    take: pageSize,
    skip: page ? (page - 1) * pageSize : 0,
    include: {
      _count: {
        select: {
          pedidoProductos: true,
        },
      },
      images: {
        select:{
          url: true,
          orden: true,  
          id: true,
        }
      }
    },

    orderBy: {
      id: "asc",
    },
  });
  const formattedProducts = products.map((product) => ({
    ...product,
    precio: product.precio.toNumber(),
    pedidoProductosCount: product._count.pedidoProductos,
  }));

  return {products: formattedProducts, totalPages: Math.ceil(totalPages / pageSize)};
}

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = parseFloat(formData.get("precio") as string);
  const inventario = parseInt(formData.get("inventario") as string);
  const marca = formData.get("marca") as string;
  const color = formData.get("color") as string;
  const sku = formData.get("sku") as string;
  const idCategoryStr = formData.get("id_category") as string;
  const idCategory = idCategoryStr ? parseInt(idCategoryStr) : null;
  const real_status = formData.get("real_status") as "activo" | "inactivo" | "agotado" | "pausado" | null;
  
  const slug = nombre.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

  const product = await prisma.product.create({
    data: {
      nombre,
      descripcion,
      precio,
      inventario,
      marca,
      color,
      sku,
      slug,
      vendedor: session.user.name || "Unknown",
      sellerId: Number(session.user.id),
      estado: true,
      id_category: idCategory,
      real_status: real_status || "activo",
    },
  });

  const images = formData.getAll("images") as File[];

  if (images && images.length > 0) {
    const imageData = [];

    for (let index = 0; index < images.length; index++) {
      const file = images[index];
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${product.slug}-${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const url = process.env.NEXT_PUBLIC_R2_DOMAIN 
        ? `${process.env.NEXT_PUBLIC_R2_DOMAIN}/${fileName}`
        : `${process.env.AWS_S3_ENDPOINT}/${AWS_S3_BUCKET}/${fileName}`;

      imageData.push({
        url: url,
        orden: index,
        productId: product.id,
      });
    }

    if (imageData.length > 0) {
      await prisma.productImage.createMany({
        data: imageData,
      });
    }
  }
}

export async function getCustomersCount(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return 0;
  }

const clientesUnicos = await prisma.profile.count({
  where: {
    pedidos: {
      some: { // Que tenga al menos un pedido...
        productos: {
          some: { // ...que contenga productos...
            producto: {
              sellerId: Number(session.user.id) // ...pertenecientes a este vendedor
            }
          }
        }
      }
    }
  }
});
  return clientesUnicos;
}

export async function getOrdersCount(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return 0;
  }
  const ordersCount = await prisma.pedido.count({
    where: {
      productos: {
        some: {
          producto: {
            sellerId: Number(session.user.id)
          }
        }
      }
    }
  });
  return ordersCount;
}

export async function getSalesData(
  period: 'weekly' | 'monthly' | 'yearly',
  year?: number,
  month?: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { sales: [], revenue: [], categories: [] };
  }

  const today = new Date();
  const currentYear = year || today.getFullYear();
  const currentMonth = month !== undefined ? month : today.getMonth();
  
  let startDate: Date;
  let endDate: Date;
  let categories: string[] = [];
  let sales: number[] = [];
  let revenue: number[] = [];

  if (period === 'weekly') {
    // Start of week (Monday)
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = (dayOfWeek + 6) % 7;
    startDate = new Date(today);
    startDate.setDate(today.getDate() - diffToMonday);
    startDate.setHours(0, 0, 0, 0);
    
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    categories = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    sales = new Array(7).fill(0);
    revenue = new Array(7).fill(0);

  } else if (period === 'monthly') {
    // Start of selected month
    startDate = new Date(currentYear, currentMonth, 1);
    endDate = new Date(currentYear, currentMonth + 1, 1);
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    categories = Array.from({ length: daysInMonth }, (_, i) => {
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, '0');
      const day = String(i + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    sales = new Array(daysInMonth).fill(0);
    revenue = new Array(daysInMonth).fill(0);

  } else { // yearly
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear + 1, 0, 1);
    categories = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    sales = new Array(12).fill(0);
    revenue = new Array(12).fill(0);
  }

  const salesData = await prisma.pedidoProducto.findMany({
    where: {
      producto: {
        sellerId: Number(session.user.id),
      },
      pedido: {
        fecha: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
    select: {
      cantidad: true,
      producto: {
        select: {
          precio: true,
        },
      },
      pedido: {
        select: {
          fecha: true,
        },
      },
    },
  });

  salesData.forEach((item) => {
    const date = new Date(item.pedido.fecha);
    let index = -1;

    if (period === 'weekly') {
      const day = date.getDay(); // 0 (Sun) - 6 (Sat)
      // Convert to 0 (Mon) - 6 (Sun)
      index = (day + 6) % 7;
    } else if (period === 'monthly') {
      index = date.getDate() - 1; // 1-31 -> 0-30
    } else { // yearly
      index = date.getMonth(); // 0-11
    }

    if (index >= 0 && index < sales.length) {
      sales[index] += item.cantidad;
      // @ts-ignore
      revenue[index] += item.cantidad * Number(item.producto.precio);
    }
  });

  return { sales, revenue, categories };
}