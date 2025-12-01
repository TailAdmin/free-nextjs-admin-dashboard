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
    image: string;
};

export async function getOrders() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  const userId = Number(session.user.id);

  const orders = await prisma.pedido.findMany({
    where: {
      productos: {
        some: {
          producto: {
            sellerId: userId,
          },
        },
      },
    },
    include: {
      productos: {
        where: {
          producto: {
            sellerId: userId,
          },
        },
        include: {
          producto: {
            include: {
              images: {
                where: {
                  orden: 0,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return orders.flatMap((order) =>
    order.productos.map((p) => ({
      id: p.id,
      producto: p.producto.nombre,
      categoria: p.producto.categoria ?? "N/A",
      precio: order.total.toNumber(),
      status: order.status,
      image: p.producto.images[0]?.url || "",
    }))
  );
}
