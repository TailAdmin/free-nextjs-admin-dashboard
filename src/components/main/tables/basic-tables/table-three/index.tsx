"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader as TableHead,
  TableRow,
} from "@/components/ui/table";
import { BoxIcon } from "@/icons";
import { cn } from "@/utils";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  filterFns,
  globalFilteringFeature,
  Row,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import CardFooter from "./card-footer";
import CardHeader from "./card-header";
import { latestTransactionsData } from "./data";
import TransactionRow from "./transaction-row";
import { TableThreeProps, Transaction } from "./types";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
});

const columnHelper = createColumnHelper<typeof features, Transaction>();

export default function TableThree({
  data = latestTransactionsData,
  className,
}: TableThreeProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", { id: "name" }),
        columnHelper.accessor("date", { id: "date" }),
        columnHelper.accessor("price", { id: "price" }),
        columnHelper.accessor("category", { id: "category" }),
        columnHelper.accessor("status", { id: "status" }),
      ]),
    [],
  );

  const table = useTable({
    features,
    data,
    columns,
    getRowId: (row: Transaction) => String(row.id),
    state: {
      globalFilter: searchQuery,
    },
    globalFilterFn: (
      row: Row<typeof features, Transaction>,
      _columnId: string,
      filterValue: unknown,
    ) => {
      const query = String(filterValue ?? "").trim().toLowerCase();
      if (!query) return true;
      const { name, category, status, price, date } = row.original;
      return (
        name.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        price.toLowerCase().includes(query) ||
        date.toLowerCase().includes(query)
      );
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <Card
      className={cn(
        "w-full max-w-full min-w-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      {/* Table Header Controls */}
      <CardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Table Content */}
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHead className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="h-11 min-w-44 py-3 ps-5 text-start text-sm font-normal text-gray-500 sm:ps-6 dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="h-11 min-w-44 px-4 py-3 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="h-11 min-w-32 px-4 py-3 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="h-11 min-w-36 px-4 py-3 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="h-11 min-w-28 px-4 py-3 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="h-11 min-w-16 py-3 pe-5 sm:pe-6"
                />
              </TableRow>
            </TableHead>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TransactionRow
                    key={row.original.id}
                    transaction={row.original}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <BoxIcon className="size-6 text-gray-800 dark:text-white/90" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        No transactions found
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search to find what you&apos;re looking for.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Table Footer - Pagination */}
      <CardFooter
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}

