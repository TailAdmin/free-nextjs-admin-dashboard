"use client";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { cn } from "@/utils";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import * as React from "react";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function SelectPortal({ ...props }: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />;
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "flex flex-1 items-center gap-2 truncate text-start text-gray-800 data-placeholder:text-gray-400 dark:text-white/90 dark:data-placeholder:text-gray-500",
        className,
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default" | "lg";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group/select-trigger flex w-full min-w-0 items-center justify-between gap-2 rounded-[10px] border border-gray-300 bg-white py-2.5 ps-4 pe-3.5 text-sm font-normal text-gray-800 shadow-theme-xs outline-hidden transition-all duration-200 select-none hover:border-gray-400 hover:bg-gray-50/50 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus-visible:border-brand-300 focus-visible:ring-3 focus-visible:ring-brand-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100/50 disabled:text-gray-400 disabled:shadow-none aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 focus:aria-invalid:border-red-500 focus:aria-invalid:ring-red-500/20 focus-visible:aria-invalid:border-red-500 focus-visible:aria-invalid:ring-red-500/20 data-invalid:border-red-500 data-invalid:ring-3 data-invalid:ring-red-500/20 focus:data-invalid:border-red-500 focus:data-invalid:ring-red-500/20 focus-visible:data-invalid:border-red-500 focus-visible:data-invalid:ring-red-500/20 data-popup-open:border-brand-300 data-popup-open:ring-3 data-popup-open:ring-brand-500/20 data-popup-open:aria-invalid:border-red-500 data-popup-open:aria-invalid:ring-red-500/20 data-popup-open:data-invalid:border-red-500 data-popup-open:data-invalid:ring-red-500/20 data-[size=default]:h-11 data-[size=default]:rounded-[10px] data-[size=lg]:h-12 data-[size=lg]:rounded-[10px] data-[size=lg]:py-3 data-[size=lg]:ps-4.5 data-[size=lg]:pe-3.5 data-[size=sm]:h-9 data-[size=sm]:rounded-lg data-[size=sm]:py-2 data-[size=sm]:ps-3.5 data-[size=sm]:pe-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:hover:border-gray-600 dark:hover:bg-gray-800/50 dark:focus:border-brand-500/40 dark:focus-visible:border-brand-500/40 dark:disabled:border-gray-800 dark:disabled:bg-gray-800/50 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 dark:focus:aria-invalid:border-red-500/50 dark:focus:aria-invalid:ring-red-500/40 dark:focus-visible:aria-invalid:border-red-500/50 dark:focus-visible:aria-invalid:ring-red-500/40 dark:data-invalid:border-red-500/50 dark:data-invalid:ring-red-500/40 dark:focus:data-invalid:border-red-500/50 dark:focus:data-invalid:ring-red-500/40 dark:focus-visible:data-invalid:border-red-500/50 dark:focus-visible:data-invalid:ring-red-500/40 dark:data-popup-open:border-brand-500/40 dark:data-popup-open:aria-invalid:border-red-500/50 dark:data-popup-open:aria-invalid:ring-red-500/40 dark:data-popup-open:data-invalid:border-red-500/50 dark:data-popup-open:data-invalid:ring-red-500/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="size-4 text-gray-500 transition-transform duration-200 group-hover/select-trigger:text-gray-700 group-data-popup-open/select-trigger:rotate-180 dark:text-gray-400 dark:group-hover/select-trigger:text-gray-300" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  positionerClassName,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    positionerClassName?: string;
  }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className={cn("isolate z-99999 outline-none", positionerClassName)}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "z-50 flex max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg duration-100 outline-none data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-[#1E2635]",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="flex flex-col gap-1 outline-none">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  inset,
  ...props
}: SelectPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      data-inset={inset}
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-gray-400 data-inset:ps-8 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  inset,
  ...props
}: SelectPrimitive.Item.Props & {
  inset?: boolean;
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-inset={inset}
      className={cn(
        "group/select-item relative flex w-full cursor-pointer items-center gap-3 rounded-lg py-2.5 ps-3 pe-8 text-sm font-medium text-gray-700 outline-hidden transition-colors duration-200 select-none hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-gray-100 data-highlighted:text-gray-700 data-inset:ps-8 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300 dark:focus:bg-white/5 dark:focus:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-gray-300 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-gray-500 group-hover/select-item:[&_svg]:text-gray-700 data-highlighted:[&_svg]:text-gray-700 dark:[&_svg]:text-gray-400 dark:group-hover/select-item:[&_svg]:text-gray-300 dark:data-highlighted:[&_svg]:text-gray-300 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 items-center gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <span
        className="pointer-events-none absolute inset-e-3 flex items-center justify-center text-brand-500 dark:text-brand-400"
        data-slot="select-item-indicator"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "-mx-3 my-1.5 h-px bg-gray-100 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "flex w-full cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "flex w-full cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
