"use server";

import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

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
    slug: string;
    vendedor: string;
    estado: boolean;
    vendidos: number;
    sku: string;
    idPerfil: number | null;
    id_category: number | null;
    sellerId: number | null;
    pedidoProductosCount?: number;
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

  await prisma.product.create({
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
