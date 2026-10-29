"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HorizontalSlideIcon, SearchIcon } from "@/icons";
import { DealStatus } from "./types";

export interface CardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: DealStatus | "all";
  onStatusFilterChange: (status: DealStatus | "all") => void;
}

export default function CardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </CardTitle>
      </div>

      <div className="flex w-full items-center gap-3 sm:w-auto">
        <div className="flex-1 sm:w-64 sm:flex-initial md:w-72">
          <InputGroup className="h-10 rounded-[10px] border-gray-300 dark:border-gray-700">
            <InputGroupAddon className="ps-3.5 pe-0">
              <SearchIcon className="size-5 text-gray-700 dark:text-gray-300" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </InputGroup>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-10 shrink-0 gap-2 rounded-[10px] border-gray-300 px-4 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              >
                <HorizontalSlideIcon className="size-5" />
                Filter
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("all")}
              className={
                statusFilter === "all"
                  ? "font-semibold text-brand-500 dark:text-brand-400"
                  : ""
              }
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("complete")}
              className={
                statusFilter === "complete"
                  ? "font-semibold text-brand-500 dark:text-brand-400"
                  : ""
              }
            >
              Complete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("pending")}
              className={
                statusFilter === "pending"
                  ? "font-semibold text-brand-500 dark:text-brand-400"
                  : ""
              }
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("cancel")}
              className={
                statusFilter === "cancel"
                  ? "font-semibold text-brand-500 dark:text-brand-400"
                  : ""
              }
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

