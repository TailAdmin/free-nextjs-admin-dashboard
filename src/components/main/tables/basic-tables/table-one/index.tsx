"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils";
import { tableData as defaultTableData } from "./data";
import TableOneRow from "./table-one-row";
import { TableOneProps } from "./types";

export default function TableOne({
  data = defaultTableData,
  className,
}: TableOneProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3",
        className,
      )}
    >
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400"
              >
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400"
              >
                Team
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400"
              >
                Budget
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.map((order) => (
              <TableOneRow key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
