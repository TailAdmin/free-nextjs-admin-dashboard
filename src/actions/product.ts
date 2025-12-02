"use server";

import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { s3Client, AWS_S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
