"use client";

import { cn } from "@/utils";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPortal({ ...props }: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
}

const tooltipContentVariants = cva(
  "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-outfit text-xs font-medium whitespace-nowrap shadow-tooltip transition-opacity duration-150 outline-none select-none",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white dark:bg-gray-800",
        line: "border border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface TooltipArrowProps
  extends
    TooltipPrimitive.Arrow.Props,
    VariantProps<typeof tooltipContentVariants> {}

function TooltipArrow({
  className,
  variant = "default",
  ...props
}: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "relative block h-1.5 w-3 overflow-clip border-none",
        "data-[side=bottom]:-top-1.5",
        "data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180",
        "data-[side=left]:-inset-e-2.25 data-[side=left]:rotate-90 rtl:data-[side=left]:-rotate-90",
        "data-[side=right]:-inset-s-2.25 data-[side=right]:-rotate-90 rtl:data-[side=right]:rotate-90",
        "data-[side=inline-start]:-inset-e-2.25 data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90",
        "data-[side=inline-end]:-inset-s-2.25 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90",
        "before:absolute before:inset-s-1/2 before:bottom-0 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45",
        variant === "default" && "before:bg-gray-900 dark:before:bg-gray-800",
        variant === "line" &&
          "before:border before:border-gray-200 before:bg-white dark:before:border-gray-800 dark:before:bg-gray-900",
        className,
      )}
      {...props}
    />
  );
}

interface TooltipContentProps
  extends
    TooltipPrimitive.Popup.Props,
    VariantProps<typeof tooltipContentVariants>,
    Pick<
      TooltipPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "arrowPadding"
    > {
  arrow?: boolean;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  arrowPadding = 8,
  variant = "default",
  arrow = true,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        arrowPadding={arrowPadding}
        className="isolate z-50 outline-none"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            tooltipContentVariants({ variant }),
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
            "data-[side=inline-end]:slide-in-from-left-1 data-[side=inline-start]:slide-in-from-right-1",
            className,
          )}
          {...props}
        >
          {children}
          {arrow && <TooltipArrow variant={variant} />}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  tooltipContentVariants,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger
};

