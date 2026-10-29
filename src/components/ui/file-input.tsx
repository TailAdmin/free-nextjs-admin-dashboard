"use client";

import { useField } from "@/components/ui/field";
import { cn } from "@/utils";
import * as React from "react";

function FileInput({
  className,
  id,
  ...props
}: React.ComponentProps<"input">) {
  const field = useField();
  const resolvedId = id ?? field?.id;

  return (
    <input
      type="file"
      id={resolvedId}
      data-slot="file-input"
      className={cn(
        "h-11 w-full min-w-0 cursor-pointer overflow-hidden rounded-[10px] border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:me-4 file:h-full file:cursor-pointer file:border-0 file:border-e file:border-solid file:border-gray-200 file:bg-gray-50 file:px-3.5 file:py-2.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100/50 disabled:text-gray-400 disabled:shadow-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/5 dark:file:text-gray-300 dark:hover:file:bg-white/10 dark:focus:border-brand-500/40 dark:disabled:border-gray-800 dark:disabled:bg-gray-800/50",
        className,
      )}
      {...props}
    />
  );
}

export { FileInput };
