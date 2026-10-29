"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/utils";

export interface CardFooterProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function CardFooter({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  className,
}: CardFooterProps) {
  const getPageNumbers = (): (number | "ellipsis-start" | "ellipsis-end")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis-start",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-start",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div className={cn("border-t-0 px-5 py-4 sm:px-6", className)}>
      {/* Mobile Pagination (< sm) */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
          {currentPage}/{totalPages}
        </span>

        <div className="flex items-center gap-2">
          <PaginationPrevious
            href="#"
            size="icon"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange?.(currentPage - 1);
            }}
          />
          <PaginationNext
            href="#"
            size="icon"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange?.(currentPage + 1);
            }}
          />
        </div>
      </div>

      {/* Desktop Pagination (>= sm) */}
      <div className="hidden sm:flex sm:items-center sm:justify-start">
        <Pagination className="mx-0 w-auto justify-start">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                size="icon"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange?.(currentPage - 1);
                }}
              />
            </PaginationItem>

            {pages.map((item) => {
              if (item === "ellipsis-start" || item === "ellipsis-end") {
                return (
                  <PaginationItem key={item}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              const page = item;
              const isActive = currentPage === page;

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    size="icon"
                    variant="outline"
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                size="icon"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange?.(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
