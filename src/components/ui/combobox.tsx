"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CheckIcon, ChevronDownIcon, XIcon } from "@/icons";
import { cn } from "@/utils";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import * as React from "react";

const Combobox = ComboboxPrimitive.Root;

function ComboboxPortal({ ...props }: ComboboxPrimitive.Portal.Props) {
  return <ComboboxPrimitive.Portal data-slot="combobox-portal" {...props} />;
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "group/combobox-trigger flex items-center justify-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-gray-500 transition-transform duration-200 group-hover/combobox-trigger:text-gray-700 group-data-popup-open/combobox-trigger:rotate-180 dark:text-gray-400 dark:group-hover/combobox-trigger:text-gray-300" />
        }
      />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({
  className,
  render,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(className)}
      {...props}
      render={
        render ?? (
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon className="pointer-events-none size-4" />
          </InputGroupButton>
        )
      }
    />
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  positionerClassName,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  anchor,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  > & {
    positionerClassName?: string;
  }) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className={cn("isolate z-99999 outline-none", positionerClassName)}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative z-50 flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg duration-100 outline-none data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:mb-2 *:data-[slot=input-group]:h-9 *:data-[slot=input-group]:rounded-lg *:data-[slot=input-group]:border-gray-200 *:data-[slot=input-group]:bg-gray-50/50 *:data-[slot=input-group]:shadow-none dark:border-gray-800 dark:bg-[#1E2635] dark:*:data-[slot=input-group]:border-gray-700/60 dark:*:data-[slot=input-group]:bg-gray-800/50",
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar flex max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))] scroll-py-1 flex-col gap-1 overflow-y-auto overscroll-contain outline-none data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  inset,
  ...props
}: ComboboxPrimitive.Item.Props & {
  inset?: boolean;
}) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      data-inset={inset}
      className={cn(
        "group/combobox-item relative flex w-full cursor-pointer items-center gap-3 rounded-lg py-2.5 ps-3 pe-8 text-sm font-medium text-gray-700 outline-hidden transition-colors duration-200 select-none hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-gray-100 data-highlighted:text-gray-700 data-inset:ps-8 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300 dark:focus:bg-white/5 dark:focus:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-gray-300 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-gray-500 group-hover/combobox-item:[&_svg]:text-gray-700 data-highlighted:[&_svg]:text-gray-700 dark:[&_svg]:text-gray-400 dark:group-hover/combobox-item:[&_svg]:text-gray-300 dark:data-highlighted:[&_svg]:text-gray-300 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    >
      <span className="flex flex-1 shrink-0 items-center gap-2 whitespace-nowrap">
        {children}
      </span>
      <span
        className="pointer-events-none absolute inset-e-3 flex items-center justify-center text-brand-500 dark:text-brand-400"
        data-slot="combobox-item-indicator"
      >
        <ComboboxPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ComboboxPrimitive.ItemIndicator>
      </span>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxItemIndicator({
  className,
  children,
  ...props
}: ComboboxPrimitive.ItemIndicator.Props) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      className={cn("size-4 text-brand-500 dark:text-brand-400", className)}
      {...props}
    >
      {children || <CheckIcon className="size-4" />}
    </ComboboxPrimitive.ItemIndicator>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  inset,
  ...props
}: ComboboxPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      data-inset={inset}
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-gray-400 data-inset:ps-8 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-3 text-center text-sm text-gray-500 group-data-empty/combobox-content:flex dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "-mx-3 my-1.5 h-px bg-gray-100 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-11 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-[10px] border border-gray-300 bg-white py-1.5 ps-3 pe-3 text-sm font-normal text-gray-800 shadow-theme-xs outline-hidden transition-colors focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/20 hover:border-gray-400 has-disabled:cursor-not-allowed has-disabled:border-gray-200 has-disabled:bg-gray-100/50 has-disabled:text-gray-400 has-disabled:shadow-none has-aria-invalid:border-red-500 has-aria-invalid:ring-3 has-aria-invalid:ring-red-500/20 focus-within:has-aria-invalid:border-red-500 focus-within:has-aria-invalid:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus-within:border-brand-500/40 dark:focus-within:ring-brand-500/20 dark:hover:border-gray-600 dark:has-disabled:border-gray-800 dark:has-disabled:bg-gray-800/50 dark:has-disabled:text-gray-500 dark:has-aria-invalid:border-red-500/50 dark:has-aria-invalid:ring-red-500/40 dark:focus-within:has-aria-invalid:border-red-500/50 dark:focus-within:has-aria-invalid:ring-red-500/40",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-7 w-fit items-center justify-center gap-1.5 rounded-md bg-gray-100 ps-2.5 pe-1 text-xs font-medium text-gray-700 select-none has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 dark:bg-white/5 dark:text-gray-300",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className="inline-flex items-center justify-center text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          data-slot="combobox-chip-remove"
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-5 rounded-sm p-0 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
            >
              <XIcon className="pointer-events-none size-3.5" />
            </Button>
          }
        />
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "min-w-16 flex-1 bg-transparent py-1 text-sm font-normal text-gray-800 outline-none placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-gray-500",
        className,
      )}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxPortal,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
