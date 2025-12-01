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

export async function getProducts({page, pageSize = 5}:{page?:number, pageSize?: number}): Promise<{products: Product[], totalPages: number}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {products: [], totalPages: 0};
  }
  const totalPages = await prisma.product.count({
    where: {
      sellerId: Number(session.user.id),
    },
  });

  const products = await prisma.product.findMany({
    where: {
      sellerId: Number(session.user.id),
    },
    take: pageSize,
    skip: page ? (page - 1) * pageSize : 0,
    include:{
      _count:{
        select:{
          pedidoProductos:true
        }
      },
    },
    orderBy: {
      id: 'desc'
    }
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
    },
  });

}
