"use client";

import { cn } from "@/utils";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-4 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center text-gray-500 dark:text-gray-400",
  {
    variants: {
      variant: {
        default:
          "w-fit rounded-lg bg-gray-100 p-1 group-data-[orientation=horizontal]/tabs:h-11 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col dark:bg-gray-900",
        line: "w-full justify-start gap-2 border-b border-gray-200 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-12 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:gap-1 group-data-[orientation=vertical]/tabs:border-e group-data-[orientation=vertical]/tabs:border-b-0 dark:border-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 font-outfit text-sm font-medium whitespace-nowrap outline-hidden transition-colors duration-200 select-none",
        "focus-visible:ring-3 focus-visible:ring-brand-500/20 focus-visible:outline-hidden",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        // Variant: Default
        "group-data-[variant=default]/tabs-list:h-9 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-2",
        "group-data-[variant=default]/tabs-list:text-gray-500 group-data-[variant=default]/tabs-list:hover:text-gray-900 dark:group-data-[variant=default]/tabs-list:text-gray-400 dark:group-data-[variant=default]/tabs-list:hover:text-white",
        "group-data-[variant=default]/tabs-list:data-active:bg-white group-data-[variant=default]/tabs-list:data-active:text-gray-900 group-data-[variant=default]/tabs-list:data-active:shadow-theme-xs dark:group-data-[variant=default]/tabs-list:data-active:bg-white/3 dark:group-data-[variant=default]/tabs-list:data-active:text-white",
        "group-data-[orientation=vertical]/tabs:group-data-[variant=default]/tabs-list:w-full group-data-[orientation=vertical]/tabs:group-data-[variant=default]/tabs-list:justify-start",
        // Variant: Line
        "group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:h-12 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:px-3",
        "group-data-[variant=line]/tabs-list:text-gray-500 group-data-[variant=line]/tabs-list:hover:text-gray-700 dark:group-data-[variant=line]/tabs-list:text-gray-400 dark:group-data-[variant=line]/tabs-list:hover:text-gray-200",
        "group-data-[variant=line]/tabs-list:data-active:border-brand-500 group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:text-brand-500 group-data-[variant=line]/tabs-list:data-active:shadow-none dark:group-data-[variant=line]/tabs-list:data-active:border-brand-400 dark:group-data-[variant=line]/tabs-list:data-active:text-brand-400",
        "group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:-me-px group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:h-auto group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:w-full group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:justify-start group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:border-e-2 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:border-b-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:py-2.5",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-sm text-gray-500 outline-none dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
