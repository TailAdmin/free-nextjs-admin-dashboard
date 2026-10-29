"use client";

import { cn } from "@/utils";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

export interface SwitchProps extends SwitchPrimitive.Root.Props {
  size?: "sm" | "default";
}

const switchVariants = {
  default: {
    root: "h-6 w-13 p-0.5",
    thumb: "h-5 w-[30px] data-checked:translate-x-[18px] rtl:data-checked:-translate-x-[18px]",
  },
  sm: {
    root: "h-5 w-11 p-[1.5px]",
    thumb: "h-[17px] w-[26px] data-checked:translate-x-[15px] rtl:data-checked:-translate-x-[15px]",
  },
} as const;

function Switch({ className, size = "default", ...props }: SwitchProps) {
  const currentVariant = switchVariants[size] ?? switchVariants.default;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors outline-hidden select-none",
        "focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-hidden dark:focus-visible:ring-brand-500/30",
        "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
        "data-checked:bg-brand-500 data-checked:hover:bg-brand-600 dark:data-checked:bg-brand-500 dark:data-checked:hover:bg-brand-600",
        "data-disabled:cursor-not-allowed data-disabled:bg-gray-100 data-disabled:hover:bg-gray-100 dark:data-disabled:bg-gray-800 dark:data-disabled:hover:bg-gray-800",
        "data-disabled:data-checked:bg-gray-100 data-disabled:data-checked:hover:bg-gray-100 dark:data-disabled:data-checked:bg-gray-800 dark:data-disabled:data-checked:hover:bg-gray-800",
        "group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2",
        "aria-invalid:ring-3 aria-invalid:ring-error-500/20 dark:aria-invalid:ring-error-500/40",
        currentVariant.root,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block shrink-0 rounded-full bg-white shadow-theme-sm ring-0 transition-transform duration-150 ease-linear",
          "data-unchecked:translate-x-0 rtl:data-unchecked:translate-x-0",
          currentVariant.thumb,
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
