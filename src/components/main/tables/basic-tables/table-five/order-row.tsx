"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { AnalyticsOrder } from "./types";

export interface OrderRowProps {
  order: AnalyticsOrder;
}

const categoryMap: Record<string, string> = {
  uiKits: "UI Kits",
  templates: "Templates",
  saas: "SaaS",
};

export default function OrderRow({ order }: OrderRowProps) {
  const category = categoryMap[order.category] ?? order.category;

  return (
    <TableRow>
      <TableCell className="py-3 ps-4 text-start text-sm font-medium text-gray-800 sm:ps-6 dark:text-white/90">
        {order.name}
      </TableCell>
      <TableCell className="py-3 text-start text-sm text-gray-500 dark:text-gray-400">
        {category}
      </TableCell>
      <TableCell className="py-3 text-start text-sm text-gray-500 dark:text-gray-400">
        <div className="h-5 w-5">
          <Image
            src={order.country}
            className="h-5 w-5 rounded-sm object-fill"
            alt={order.name}
            width={20}
            height={20}
          />
        </div>
      </TableCell>
      <TableCell className="py-3 text-start text-sm text-gray-500 dark:text-gray-400">
        {order.cr}
      </TableCell>
      <TableCell className="py-3 pe-4 text-start text-sm font-medium text-green-600 sm:pe-6 dark:text-green-500">
        ${order.value}
      </TableCell>
    </TableRow>
  );
}

