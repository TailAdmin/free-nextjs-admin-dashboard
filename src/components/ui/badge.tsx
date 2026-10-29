import { cn } from "@/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 font-medium whitespace-nowrap transition-colors select-none [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        light: "",
        solid: "",
        ghost: "bg-transparent",
      },
      color: {
        primary: "",
        success: "",
        error: "",
        warning: "",
        info: "",
        gray: "",
        light: "",
        dark: "",
      },
      size: {
        sm: "h-5.5 rounded-lg px-2 py-0.5 text-xs [&:has(>svg:first-child)]:ps-1.5 [&:has(>svg:last-child)]:pe-1.5 [&>svg]:size-3",
        default:
          "h-6 rounded-lg px-2.5 py-0.5 text-sm [&:has(>svg:first-child)]:ps-2 [&:has(>svg:last-child)]:pe-2 [&>svg]:size-3.5",
        lg: "h-7 rounded-[10px] px-3 py-1 text-sm [&:has(>svg:first-child)]:ps-2.5 [&:has(>svg:last-child)]:pe-2.5 [&>svg]:size-3.5",
      },
    },
    compoundVariants: [
      // Ghost size overrides
      {
        variant: "ghost",
        className:
          "px-0 py-0 [&:has(>svg:first-child)]:ps-0 [&:has(>svg:last-child)]:pe-0",
      },
      // Primary
      {
        variant: "light",
        color: "primary",
        className:
          "bg-brand-50 text-brand-500 [text-shadow:0_4px_4px_var(--color-brand-200)] dark:bg-brand-500/15 dark:text-brand-400 dark:[text-shadow:0_4px_4px_rgba(70,95,255,0.20)]",
      },
      {
        variant: "solid",
        color: "primary",
        className:
          "bg-brand-500 text-white shadow-[0_4px_8px_0_var(--color-brand-200)] dark:shadow-[0_4px_8px_0_rgba(70,95,255,0.20)]",
      },
      {
        variant: "ghost",
        color: "primary",
        className: "text-brand-500 dark:text-brand-400",
      },
      // Success
      {
        variant: "light",
        color: "success",
        className:
          "bg-green-50 text-green-600 [text-shadow:0_4px_4px_var(--color-green-200)] dark:bg-green-500/15 dark:text-green-500 dark:[text-shadow:0_4px_4px_rgba(18,183,106,0.20)]",
      },
      {
        variant: "solid",
        color: "success",
        className:
          "bg-green-500 text-white shadow-[0_4px_8px_0_var(--color-green-200)] dark:shadow-[0_4px_8px_0_rgba(18,183,106,0.20)]",
      },
      {
        variant: "ghost",
        color: "success",
        className: "text-green-600 dark:text-green-500",
      },
      // Error
      {
        variant: "light",
        color: "error",
        className:
          "bg-red-50 text-red-600 [text-shadow:0_4px_4px_var(--color-red-200)] dark:bg-red-500/15 dark:text-red-500 dark:[text-shadow:0_4px_4px_rgba(240,68,56,0.20)]",
      },
      {
        variant: "solid",
        color: "error",
        className:
          "bg-red-500 text-white shadow-[0_4px_8px_0_var(--color-red-200)] dark:shadow-[0_4px_8px_0_rgba(240,68,56,0.20)]",
      },
      {
        variant: "ghost",
        color: "error",
        className: "text-red-600 dark:text-red-500",
      },
      // Warning
      {
        variant: "light",
        color: "warning",
        className:
          "bg-amber-50 text-amber-600 [text-shadow:0_4px_4px_rgba(254,223,137,0.60)] dark:bg-amber-500/15 dark:text-orange-400 dark:[text-shadow:0_4px_4px_rgba(247,144,9,0.20)]",
      },
      {
        variant: "solid",
        color: "warning",
        className:
          "bg-amber-500 text-white shadow-[0_4px_8px_0_rgba(254,223,137,0.60)] dark:shadow-[0_4px_8px_0_rgba(247,144,9,0.20)]",
      },
      {
        variant: "ghost",
        color: "warning",
        className: "text-amber-600 dark:text-orange-400",
      },
      // Info
      {
        variant: "light",
        color: "info",
        className:
          "bg-sky-50 text-sky-500 [text-shadow:0_4px_4px_var(--color-sky-200)] dark:bg-sky-500/15 dark:text-sky-500 dark:[text-shadow:0_4px_4px_rgba(11,165,236,0.20)]",
      },
      {
        variant: "solid",
        color: "info",
        className:
          "bg-sky-500 text-white shadow-[0_4px_8px_0_rgba(184,230,254,1)] dark:shadow-[0_4px_8px_0_rgba(11,165,236,0.20)]",
      },
      {
        variant: "ghost",
        color: "info",
        className: "text-sky-500",
      },
      // Gray
      {
        variant: "light",
        color: "gray",
        className:
          "bg-gray-100 text-gray-700 [text-shadow:0_4px_4px_var(--color-gray-300)] dark:bg-white/5 dark:text-white/80 dark:[text-shadow:0_4px_4px_rgba(255,255,255,0.10)]",
      },
      {
        variant: "solid",
        color: "gray",
        className:
          "bg-gray-700 text-white shadow-[0_4px_8px_0_rgba(209,213,220,1)] dark:bg-gray-700 dark:text-white dark:shadow-[0_4px_8px_0_rgba(255,255,255,0.10)]",
      },
      {
        variant: "ghost",
        color: "gray",
        className: "text-gray-700 dark:text-gray-300",
      },
      // Light (alias)
      {
        variant: "light",
        color: "light",
        className:
          "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      },
      {
        variant: "solid",
        color: "light",
        className: "bg-gray-400 text-white dark:bg-white/5 dark:text-white/80",
      },
      {
        variant: "ghost",
        color: "light",
        className: "text-gray-700 dark:text-gray-300",
      },
      // Dark (alias)
      {
        variant: "light",
        color: "dark",
        className:
          "bg-gray-500/15 text-gray-800 dark:bg-white/5 dark:text-white",
      },
      {
        variant: "solid",
        color: "dark",
        className: "bg-gray-800 text-white dark:bg-gray-700 dark:text-white",
      },
      {
        variant: "ghost",
        color: "dark",
        className: "text-gray-800 dark:text-white",
      },
    ],
    defaultVariants: {
      variant: "light",
      color: "primary",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends
    Omit<useRender.ComponentProps<"span">, "color">,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant = "light",
  color = "primary",
  size = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        className: cn(badgeVariants({ variant, color, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      color,
      size,
    },
  });
}

export { Badge, badgeVariants };
