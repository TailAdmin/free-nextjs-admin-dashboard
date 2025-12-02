import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function PaginationSkeleton() {
    return (
        <div className="flex items-center justify-start md:self-end ">
          <button
            className="mr-2.5 flex items-center w-10 h-10 justify-center rounded-lg border border-gray-300 bg-foreground/10 px-2.5 py-2.5 text-gray-700 shadow-theme-xs disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400  text-sm"
            disabled={true}
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
            disabled={true}
                className={`px-4 py-2 rounded ${
                  "text-gray-700 dark:text-gray-400"
                } flex w-10 items-center justify-center bg-foreground/10 h-10 rounded-lg text-sm font-medium  `}
              />
            <span className="px-2 w-10">...</span>
          </div>
          <button
            disabled={true}
            className="ml-2.5 flex items-center justify-center w-10 rounded-lg border border-gray-300 animate-pulse bg-foreground/10 px-2.5 py-2.5 text-gray-700 shadow-theme-xs text-sm  h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 "
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
    )
}