"use server";

import prisma from "@/prisma/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export type Order = {
    id: number;
    producto: string;
    categoria: string;
    precio: number;
    status: string;
    fecha: Date;
    images: {
        id: number;
        url: string;
        orden: number;
    }[];
};

export async function getOrders({
  page = 1,
  pageSize = 5,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { orders: [], totalPages: 0 };
  }

  const userId = Number(session.user.id);

  const where = {
    producto: {
      sellerId: userId,
    },
  };

  const totalCount = await prisma.pedidoProducto.count({
    where,
  });

  const soldItems = await prisma.pedidoProducto.findMany({
    where,
    include: {
      producto: {
        include: {
          images: {
            select: {
              id: true,
              url: true,
              orden: true,
          },},
          category: true,
          
        },
        
      },
      pedido: true,
    },
    orderBy: {
      pedido: {
        fecha: "desc",
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const orders = soldItems.map((item) => ({
    id: item.id,
    producto: item.producto.nombre,
    categoria: item.producto.category?.name ?? "N/A",
    precio: item.pedido.total.toNumber(), // Keeping original behavior of showing order total
    status: item.pedido.status,
    images: item.producto.images,
    fecha: item.pedido.fecha,
  }));

  return {
    orders,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
