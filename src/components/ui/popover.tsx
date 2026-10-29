"use client";

import { cn } from "@/utils";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import * as React from "react";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  arrowPadding = side === "left" || side === "right" ? 48 : 8,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "arrowPadding"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        arrowPadding={arrowPadding}
        className="isolate z-50 outline-none"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 w-full max-w-97.5 origin-(--transform-origin) rounded-xl border-none bg-white text-gray-800 shadow-theme-md duration-100 outline-none dark:bg-[#1E2635] dark:text-gray-300",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn(
        "rounded-t-xl border-b border-gray-200 bg-gray-100 px-5 py-3 dark:border-gray-800 dark:bg-gray-800",
        className,
      )}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn(
        "text-base leading-6 font-semibold text-gray-800 dark:text-white/90",
        className,
      )}
      {...props}
    />
  );
}

function PopoverBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-body"
      className={cn("space-y-3 p-5", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn(
        "text-sm leading-5 text-gray-500 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn("flex items-center gap-3 pt-1", className)}
      {...props}
    />
  );
}

function PopoverArrow({ className, ...props }: PopoverPrimitive.Arrow.Props) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(
        "relative block h-1.5 w-3 overflow-clip border-none",
        "data-[side=bottom]:-top-1.5",
        "data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180",
        "data-[side=left]:-inset-e-2.25 data-[side=left]:rotate-90 rtl:data-[side=left]:-rotate-90",
        "data-[side=right]:-inset-s-2.25 data-[side=right]:-rotate-90 rtl:data-[side=right]:rotate-90",
        "data-[side=inline-start]:-inset-e-2.25 data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90",
        "data-[side=inline-end]:-inset-s-2.25 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90",
        "before:absolute before:inset-s-1/2 before:bottom-0 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45",
        "data-[side=bottom]:before:bg-gray-100 dark:data-[side=bottom]:before:bg-gray-800",
        "data-[side=top]:before:bg-white dark:data-[side=top]:before:bg-[#1E2635]",
        "data-[side=left]:before:bg-white dark:data-[side=left]:before:bg-[#1E2635]",
        "data-[side=right]:before:bg-white dark:data-[side=right]:before:bg-[#1E2635]",
        "data-[side=inline-start]:before:bg-white dark:data-[side=inline-start]:before:bg-[#1E2635]",
        "data-[side=inline-end]:before:bg-white dark:data-[side=inline-end]:before:bg-[#1E2635]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
};
