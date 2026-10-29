"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CalendarIcon, SearchIcon } from "@/icons";
import { cn } from "@/utils";

export interface CardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

export default function CardHeader({
  searchQuery = "",
  onSearchChange,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className,
      )}
    >
      <div>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Latest Transactions
        </CardTitle>
      </div>

      <div className="flex w-full items-center gap-3 sm:w-auto">
        <InputGroup className="h-10 flex-1 sm:w-75 sm:flex-initial">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-5 text-gray-400" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </InputGroup>

        <Button
          variant="outline"
          className="h-10 shrink-0 px-3.5 text-gray-700 sm:px-4 sm:py-2.5 dark:text-gray-300"
        >
          <CalendarIcon className="size-5" />
          <span className="hidden sm:inline">05 Feb - 06 March</span>
        </Button>
      </div>
    </div>
  );
}


