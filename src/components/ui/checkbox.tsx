"use client";

import { useField } from "@/components/ui/field";
import { CheckIcon } from "@/icons";
import { cn } from "@/utils";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

function Checkbox({ className, id, ...props }: CheckboxPrimitive.Root.Props) {
  const field = useField();
  const resolvedId = id ?? field?.id;

  return (
    <CheckboxPrimitive.Root
      id={resolvedId}
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white shadow-theme-xs outline-hidden transition-colors group-has-focus-visible/field-label:ring-0 group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-brand-500 focus-visible:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100/50 disabled:shadow-none aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 data-checked:border-brand-500 data-checked:bg-brand-500 data-checked:text-white data-checked:hover:border-brand-600 data-checked:hover:bg-brand-600 aria-invalid:data-checked:border-red-500 aria-invalid:data-checked:bg-red-500 data-disabled:data-checked:border-gray-200 data-disabled:data-checked:bg-transparent data-disabled:data-checked:text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-400 dark:focus-visible:border-brand-400 dark:focus-visible:ring-brand-500/30 dark:disabled:border-gray-800 dark:disabled:bg-gray-800/50 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 dark:data-checked:border-brand-500 dark:data-checked:bg-brand-500 dark:data-checked:hover:border-brand-600 dark:data-checked:hover:bg-brand-600 dark:data-disabled:data-checked:border-gray-800 dark:data-disabled:data-checked:text-gray-600",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
