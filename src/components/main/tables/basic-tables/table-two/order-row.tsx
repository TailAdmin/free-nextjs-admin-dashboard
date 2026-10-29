"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { cn } from "@/utils";
import { CrmOrder, DealStatus } from "./types";

export interface OrderRowProps {
  order: CrmOrder;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusBadgeConfig: Record<
  DealStatus,
  { label: string; color: "success" | "warning" | "error" }
> = {
  complete: { label: "Complete", color: "success" },
  pending: { label: "Pending", color: "warning" },
  cancel: { label: "Cancel", color: "error" },
};

export default function OrderRow({
  order,
  isSelected,
  onSelect,
  onDelete,
}: OrderRowProps) {
  const statusConfig = statusBadgeConfig[order.status] ?? {
    label: order.status,
    color: "warning" as const,
  };

  return (
    <TableRow>
      <TableCell className="px-6 py-4 text-start">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(order.id)}
            aria-label={`Select deal ${order.dealId}`}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
            {order.dealId}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4 text-start">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback
              className={cn(
                "size-full text-xs font-semibold select-none",
                order.user.avatarClassName,
              )}
            >
              {order.user.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
              {order.user.name}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {order.user.email}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4 text-start">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          {order.productName}
        </span>
      </TableCell>

      <TableCell className="px-6 py-4 text-start">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          {order.dealValue}
        </span>
      </TableCell>

      <TableCell className="px-6 py-4 text-start">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          {order.closeDate}
        </span>
      </TableCell>

      <TableCell className="px-6 py-4 text-start">
        <Badge variant="light" size="sm" color={statusConfig.color}>
          {statusConfig.label}
        </Badge>
      </TableCell>

      <TableCell className="px-6 py-4 text-center">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
          onClick={() => onDelete?.(order.id)}
          aria-label="Delete order"
        >
          <TrashBinIcon className="size-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

