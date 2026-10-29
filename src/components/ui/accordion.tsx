"use client";

import { ChevronDownIcon } from "@/icons";
import { cn } from "@/utils";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-gray-200 last:border-b-0 dark:border-gray-800",
        className,
      )}
      {...props}
    />
  );
}

function AccordionHeader({
  className,
  ...props
}: AccordionPrimitive.Header.Props) {
  return (
    <AccordionPrimitive.Header
      data-slot="accordion-header"
      className={className}
      {...props}
    />
  );
}

interface AccordionTriggerProps extends AccordionPrimitive.Trigger.Props {
  showIcon?: boolean;
}

function AccordionTrigger({
  className,
  children,
  showIcon = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between py-4 text-start text-sm font-medium text-gray-800 transition-all outline-none hover:underline focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/20 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-white/90 dark:focus-visible:ring-brand-500/30",
          className,
        )}
        {...props}
      >
        {children}
        {showIcon && (
          <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none size-4 shrink-0 text-gray-500 transition-transform duration-200 ease-in-out group-hover/accordion-trigger:text-gray-700 group-aria-expanded/accordion-trigger:rotate-180 group-data-panel-open/accordion-trigger:rotate-180 dark:text-gray-400 dark:group-hover/accordion-trigger:text-gray-300"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-300 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div
        className={cn(
          "pb-4 pt-0 text-gray-500 dark:text-gray-400 [&_a]:text-brand-500 [&_a]:underline [&_a]:underline-offset-3 hover:[&_a]:text-brand-600 dark:[&_a]:text-brand-400 dark:hover:[&_a]:text-brand-300 [&_p:not(:last-child)]:mb-3",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
};


