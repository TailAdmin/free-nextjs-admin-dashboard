import { cn } from "@/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-hidden active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 focus-visible:ring-3 focus-visible:ring-brand-500/20 disabled:bg-brand-200 disabled:text-white dark:bg-brand-500 dark:hover:bg-brand-600 dark:disabled:bg-brand-800 dark:disabled:text-brand-400",
        outline:
          "border-gray-300 bg-transparent text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-3 focus-visible:ring-gray-300/50 disabled:border-gray-200 disabled:bg-white disabled:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-600",
        ghost:
          "border-none bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-3 focus-visible:ring-gray-300/50 disabled:border-gray-200 disabled:bg-white disabled:text-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-600",
        destructive:
          "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 focus-visible:ring-3 focus-visible:ring-red-500/20 disabled:bg-red-200 disabled:text-white dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-950 dark:disabled:text-red-400",
        link: "h-auto! p-0! font-normal text-brand-500 underline-offset-4 hover:underline dark:text-brand-400",
      },
      size: {
        default:
          "h-10 gap-2 rounded-[10px] px-4 py-2.5 [&:has(>svg:first-child)]:ps-3 [&:has(>svg:last-child)]:pe-3",
        xs: "h-8 gap-1.5 rounded-lg px-3 py-1.5 in-data-[slot=button-group]:rounded-lg [&:has(>svg:first-child)]:ps-2.5 [&:has(>svg:last-child)]:pe-2.5",
        sm: "h-9 gap-1.5 rounded-lg px-4 py-2 in-data-[slot=button-group]:rounded-lg [&:has(>svg:first-child)]:ps-3 [&:has(>svg:last-child)]:pe-3",
        lg: "h-11 gap-2 rounded-[10px] px-5 py-3 [&:has(>svg:first-child)]:ps-4 [&:has(>svg:last-child)]:pe-4",
        icon: "size-10 rounded-[10px]",
        "icon-xs": "size-8 rounded-lg in-data-[slot=button-group]:rounded-lg",
        "icon-sm": "size-9 rounded-lg in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
