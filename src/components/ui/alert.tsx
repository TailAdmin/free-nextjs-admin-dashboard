import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-xl border px-2.5 py-2 text-start text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-white text-gray-700 border-gray-200 dark:border-gray-800 dark:bg-[#1E2634] dark:text-gray-300",
        success:
          "bg-green-50 border-green-500 *:[svg]:text-green-500 dark:bg-green-500/10 dark:border-green-500/30 dark:*:[svg]:text-green-400",
        warning:
          "bg-amber-50 border-amber-500 *:[svg]:text-amber-500 dark:bg-amber-500/10 dark:border-amber-500/30 dark:*:[svg]:text-amber-400",
        destructive:
          "bg-red-50 border-red-500 *:[svg]:text-red-500 dark:bg-red-500/10 dark:border-red-500/30 dark:*:[svg]:text-red-400",
        info: "bg-sky-50 border-sky-500 *:[svg]:text-sky-500 dark:bg-sky-500/10 dark:border-sky-500/30 dark:*:[svg]:text-sky-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "[&_a]:hover:text-foreground text-base font-medium text-gray-800 group-has-[>svg]/alert:col-start-2 dark:text-white/90 [&_a]:underline [&_a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "[&_a]:hover:text-foreground text-sm text-balance text-gray-500 md:text-pretty dark:text-gray-400 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute inset-e-2 top-2", className)}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
