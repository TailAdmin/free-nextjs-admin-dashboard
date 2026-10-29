"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
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
  RowSelectionState,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import CardHeader from "./card-header";
import { recentOrdersData } from "./data";
import OrderRow from "./order-row";
import { CrmOrder, DealStatus } from "./types";

export interface TableTwoProps {
  data?: CrmOrder[];
  className?: string;
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
});

const columnHelper = createColumnHelper<typeof features, CrmOrder>();

export default function TableTwo({
  data = recentOrdersData,
  className,
}: TableTwoProps = {}) {
  const [orders, setOrders] = useState<CrmOrder[]>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DealStatus | "all">("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "1": true,
  });

  const columnFilters = useMemo(
    () =>
      statusFilter !== "all" ? [{ id: "status", value: statusFilter }] : [],
    [statusFilter],
  );

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("dealId", { id: "dealId" }),
        columnHelper.accessor(
          (row: CrmOrder) => `${row.user.name} ${row.user.email}`,
          { id: "customer" },
        ),
        columnHelper.accessor("productName", { id: "productName" }),
        columnHelper.accessor("dealValue", { id: "dealValue" }),
        columnHelper.accessor("closeDate", { id: "closeDate" }),
        columnHelper.accessor("status", { id: "status", filterFn: "equals" }),
      ]),
    [],
  );

  const table = useTable({
    features,
    data: orders,
    columns,
    getRowId: (row: CrmOrder) => row.id,
    state: {
      globalFilter: searchQuery,
      columnFilters,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (
      row: Row<typeof features, CrmOrder>,
      _columnId: string,
      filterValue: unknown,
    ) => {
      const query = String(filterValue ?? "").trim().toLowerCase();
      if (!query) return true;
      const { dealId, user, productName } = row.original;
      return (
        dealId.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        productName.toLowerCase().includes(query)
      );
    },
  });

  const rows = table.getRowModel().rows;
  const isAllSelected = rows.length > 0 && table.getIsAllRowsSelected();

  const handleSelectAll = () => {
    table.toggleAllRowsSelected();
  };

  const handleRowSelect = (id: string) => {
    table.getRow(id)?.toggleSelected();
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setRowSelection((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <Card
      className={cn(
        "w-full max-w-full min-w-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      {/* Table Header Controls */}
      <CardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table Content */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-175 2xl:min-w-202">
          <Table>
            <TableHeader className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                    <span>Deal ID</span>
                  </div>
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Customer
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Product/Service
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Deal Value
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Close Date
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>

                <TableCell
                  isHeader
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="min-h-96 divide-y divide-gray-100 dark:divide-gray-800">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <OrderRow
                    key={row.original.id}
                    order={row.original}
                    isSelected={row.getIsSelected()}
                    onSelect={handleRowSelect}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <BoxIcon className="size-6 text-gray-800 dark:text-white/90" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        No orders found
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter to find what you&apos;re looking for.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}

