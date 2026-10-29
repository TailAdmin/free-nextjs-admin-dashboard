"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Product } from "./types";

export interface OrderRowProps {
  order: Product;
}

export default function OrderRow({ order }: OrderRowProps) {
  const t = useTranslations("ecommerce.recentOrders");

  return (
    <TableRow>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className="h-12.5 w-12.5 overflow-hidden rounded-md">
            <Image
              width={50}
              height={50}
              src={order.image}
              className="h-12.5 w-12.5"
              alt={order.name}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {order.name}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("variants", { count: order.variants })}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
        {t(`categories.${order.category}`)}
      </TableCell>
      <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
        {order.price}
      </TableCell>
      <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
        <Badge
          size="sm"
          color={
            order.status === "delivered"
              ? "success"
              : order.status === "pending"
                ? "warning"
                : "error"
          }
        >
          {t(`statuses.${order.status}`)}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
