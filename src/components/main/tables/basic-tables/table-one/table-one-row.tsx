"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from "./types";

export interface TableOneRowProps {
  order: Order;
}

export function TableOneUserCell({ user }: { user: Order["user"] }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <Avatar size="default">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
          {user.name}
        </span>
        <span className="block text-xs text-gray-500 dark:text-gray-400">
          {user.role}
        </span>
      </div>
    </div>
  );
}

export function TableOneTeamCell({ team }: { team: Order["team"] }) {
  return (
    <AvatarGroup className="-space-x-2">
      {team.images.map((image, index) => (
        <Avatar key={index} size="xs">
          <AvatarImage src={image} alt={`Team member ${index + 1}`} />
          <AvatarFallback>{index + 1}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export function TableOneStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, "success" | "warning" | "error" | "gray"> = {
    Active: "success",
    Pending: "warning",
    Cancel: "error",
  };

  return (
    <Badge size="sm" color={colorMap[status] ?? "gray"}>
      {status}
    </Badge>
  );
}

export default function TableOneRow({ order }: TableOneRowProps) {
  return (
    <TableRow className="transition hover:bg-gray-50/50 dark:hover:bg-white/2">
      <TableCell className="px-5 py-4 text-start sm:px-6">
        <TableOneUserCell user={order.user} />
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-sm text-gray-500 sm:px-6 dark:text-gray-400">
        {order.projectName}
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-sm text-gray-500 sm:px-6 dark:text-gray-400">
        <TableOneTeamCell team={order.team} />
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-sm text-gray-500 sm:px-6 dark:text-gray-400">
        <TableOneStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-sm text-gray-500 sm:px-6 dark:text-gray-400">
        {order.budget}
      </TableCell>
    </TableRow>
  );
}
