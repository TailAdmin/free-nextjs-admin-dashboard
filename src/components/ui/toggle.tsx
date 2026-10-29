"use client";

import { cn } from "@/utils";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

const toggleVariants = cva(
  "group/toggle inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-gray-300/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:focus-visible:ring-gray-700/50 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-800 aria-pressed:bg-gray-100 aria-pressed:text-gray-900 data-pressed:bg-gray-100 data-pressed:text-gray-900 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 disabled:border-transparent disabled:bg-transparent disabled:text-gray-300 dark:border-transparent dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white dark:data-pressed:bg-gray-800 dark:data-pressed:text-white dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-white dark:disabled:text-gray-600",
        outline:
          "border-gray-200 bg-transparent text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 aria-pressed:border-gray-200 aria-pressed:bg-gray-100 aria-pressed:text-gray-900 data-pressed:border-gray-200 data-pressed:bg-gray-100 data-pressed:text-gray-900 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 disabled:border-gray-200 disabled:bg-white disabled:text-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white dark:aria-pressed:border-gray-700 dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white dark:data-pressed:border-gray-700 dark:data-pressed:bg-gray-800 dark:data-pressed:text-white dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-white dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-600",
      },
      size: {
        default:
          "h-10 min-w-10 gap-2 rounded-[10px] px-3.5 py-2.5 in-data-[slot=toggle-group]:rounded-[10px] [&:has(>svg:first-child)]:ps-3 [&:has(>svg:last-child)]:pe-3 has-data-[icon=inline-start]:ps-3 has-data-[icon=inline-end]:pe-3",
        sm: "h-9 min-w-9 gap-1.5 rounded-lg px-3 py-2 in-data-[slot=toggle-group]:rounded-lg [&:has(>svg:first-child)]:ps-2.5 [&:has(>svg:last-child)]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 has-data-[icon=inline-end]:pe-2.5 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-8 min-w-8 gap-1.5 rounded-lg px-2.5 py-1.5 text-xs in-data-[slot=toggle-group]:rounded-lg [&:has(>svg:first-child)]:ps-2 [&:has(>svg:last-child)]:pe-2 has-data-[icon=inline-start]:ps-2 has-data-[icon=inline-end]:pe-2 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 min-w-11 gap-2 rounded-[10px] px-4 py-3 in-data-[slot=toggle-group]:rounded-[10px] [&:has(>svg:first-child)]:ps-3.5 [&:has(>svg:last-child)]:pe-3.5 has-data-[icon=inline-start]:ps-3.5 has-data-[icon=inline-end]:pe-3.5",
        icon: "size-10 rounded-[10px] p-0 in-data-[slot=toggle-group]:rounded-[10px]",
        "icon-sm":
          "size-9 rounded-lg p-0 in-data-[slot=toggle-group]:rounded-lg [&_svg:not([class*='size-'])]:size-4",
        "icon-xs":
          "size-8 rounded-lg p-0 in-data-[slot=toggle-group]:rounded-lg [&_svg:not([class*='size-'])]:size-4",
        "icon-lg":
          "size-11 rounded-[10px] p-0 in-data-[slot=toggle-group]:rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
