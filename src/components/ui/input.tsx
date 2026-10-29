"use client";

import { useField } from "@/components/ui/field";
import { cn } from "@/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

function Input({ className, type, id, ...props }: React.ComponentProps<"input">) {
  const field = useField();
  const resolvedId = id ?? field?.id;

  return (
    <InputPrimitive
      type={type}
      id={resolvedId}
      data-slot="input" 
      className={cn(
        "h-11 w-full min-w-0 rounded-[10px] border border-gray-300 bg-white py-2.5 ps-4 pe-4 text-sm font-normal text-gray-800 shadow-theme-xs outline-hidden transition-colors file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus-visible:border-brand-300 focus-visible:ring-3 focus-visible:ring-brand-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100/50 disabled:text-gray-400 disabled:shadow-none aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 focus:aria-invalid:border-red-500 focus:aria-invalid:ring-red-500/20 focus-visible:aria-invalid:border-red-500 focus-visible:aria-invalid:ring-red-500/20 data-[success=true]:border-green-500 data-[success=true]:ring-3 data-[success=true]:ring-green-500/20 focus:data-[success=true]:border-green-500 focus:data-[success=true]:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:file:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500/40 dark:focus-visible:border-brand-500/40 dark:disabled:border-gray-800 dark:disabled:bg-gray-800/50 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 dark:focus:aria-invalid:border-red-500/50 dark:focus:aria-invalid:ring-red-500/40 dark:focus-visible:aria-invalid:border-red-500/50 dark:focus-visible:aria-invalid:ring-red-500/40 dark:data-[success=true]:border-green-500/50 dark:data-[success=true]:ring-green-500/40 dark:focus:data-[success=true]:border-green-500/50 dark:focus:data-[success=true]:ring-green-500/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
