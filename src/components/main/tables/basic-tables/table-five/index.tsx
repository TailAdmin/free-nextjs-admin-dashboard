"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HorizontalSlideIcon } from "@/icons";
import { cn } from "@/utils";
import { recentOrdersData } from "./data";
import OrderRow from "./order-row";
import { TableFiveProps } from "./types";

export default function TableFive({
  data = recentOrdersData,
  className,
}: TableFiveProps = {}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <HorizontalSlideIcon />
            Filter
          </Button>
          <Button variant="outline">See all</Button>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto sm:-mx-6">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 ps-4 text-start text-xs font-medium text-gray-500 sm:ps-6 dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Country
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                CR
              </TableCell>
              <TableCell
                isHeader
                className="py-3 pe-4 text-start text-xs font-medium text-gray-500 sm:pe-6 dark:text-gray-400"
              >
                Value
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { TableFive as RecentOrderAnalytics };

