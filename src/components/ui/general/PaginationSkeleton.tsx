import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from "lucide-react";

export function PaginationSkeleton() {
    return (
        <div className="flex items-center justify-center md:justify-end gap-2">
          <div className="flex items-center gap-1">
             <button
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-foreground/10 text-gray-700 shadow-theme-xs disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                disabled={true}
            >
                <ChevronsLeft className="size-4" />
            </button>
            <button
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-foreground/10 text-gray-700 shadow-theme-xs disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                disabled={true}
            >
                <ChevronLeftIcon className="size-4" />
            </button>
          </div>
         
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1 mx-2">
                <div className="w-12 h-8 rounded-lg bg-foreground/10 animate-pulse" />
                <span className="text-sm text-gray-500 dark:text-gray-400">/ ...</span>
             </div>
             <div className="flex items-center gap-1">
                <button
                    disabled={true}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-foreground/10 text-gray-700 shadow-theme-xs disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                    <ChevronRightIcon className="size-4" />
                </button>
                <button
                    disabled={true}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-foreground/10 text-gray-700 shadow-theme-xs disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                    <ChevronsRight className="size-4" />
                </button>
             </div>
          </div>
        </div>
    )
}