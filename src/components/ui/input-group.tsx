"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-11 w-full min-w-0 items-center rounded-[10px] border border-gray-300 bg-white shadow-theme-xs outline-hidden transition-colors in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0",
        "has-[[data-slot=input-group-control]:focus]:border-brand-300 has-[[data-slot=input-group-control]:focus]:ring-3 has-[[data-slot=input-group-control]:focus]:ring-brand-500/20 has-[[data-slot=input-group-control]:focus-visible]:border-brand-300 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-brand-500/20",
        "has-[:is([data-slot=input-group-control],input,textarea):disabled]:cursor-not-allowed has-[:is([data-slot=input-group-control],input,textarea):disabled]:border-gray-200 has-[:is([data-slot=input-group-control],input,textarea):disabled]:bg-gray-100/50 has-[:is([data-slot=input-group-control],input,textarea):disabled]:shadow-none",
        "has-[[data-slot][aria-invalid=true]]:border-red-500 has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-red-500/20",
        "has-[[data-slot][data-success=true]]:border-green-500 has-[[data-slot][data-success=true]]:ring-3 has-[[data-slot][data-success=true]]:ring-green-500/20",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=inline-end]]:[&>input]:pe-2 has-[>[data-align=inline-start]]:[&>input]:ps-2",
        "dark:border-gray-700 dark:bg-gray-900",
        "dark:has-[[data-slot=input-group-control]:focus]:border-brand-500/40 dark:has-[[data-slot=input-group-control]:focus-visible]:border-brand-500/40",
        "dark:has-[:is([data-slot=input-group-control],input,textarea):disabled]:border-gray-800 dark:has-[:is([data-slot=input-group-control],input,textarea):disabled]:bg-gray-800/50",
        "dark:has-[[data-slot][aria-invalid=true]]:border-red-500/50 dark:has-[[data-slot][aria-invalid=true]]:ring-red-500/40",
        "dark:has-[[data-slot][data-success=true]]:border-green-500/50 dark:has-[[data-slot][data-success=true]]:ring-green-500/40",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-gray-500 select-none group-data-[disabled=true]/input-group:opacity-50 dark:text-gray-400 [&>kbd]:rounded-md [&>kbd]:border [&>kbd]:border-gray-200 [&>kbd]:bg-gray-50 dark:[&>kbd]:border-gray-700 dark:[&>kbd]:bg-gray-800 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-3.5 has-[>button]:-ms-1 has-[>kbd]:-ms-0.5",
        "inline-end":
          "order-last pe-3.5 has-[>button]:-me-1 has-[>kbd]:-me-0.5",
        "block-start":
          "order-first w-full justify-start ps-4 pe-4 pt-2.5 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start ps-4 pe-4 pb-2.5 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            "input, textarea",
          )
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-lg px-2.5 text-xs [&>svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-7 rounded-md p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 rounded-lg p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm font-normal text-gray-500 dark:text-gray-400 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus:border-transparent focus:ring-0 focus:outline-hidden focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent disabled:shadow-none aria-invalid:border-transparent aria-invalid:ring-0 focus:aria-invalid:border-transparent focus:aria-invalid:ring-0 focus-visible:aria-invalid:border-transparent focus-visible:aria-invalid:ring-0 data-[success=true]:border-transparent data-[success=true]:ring-0 focus:data-[success=true]:border-transparent focus:data-[success=true]:ring-0 dark:bg-transparent dark:focus:border-transparent dark:focus-visible:border-transparent dark:disabled:bg-transparent dark:aria-invalid:border-transparent dark:aria-invalid:ring-0 dark:focus:aria-invalid:border-transparent dark:focus:aria-invalid:ring-0 dark:data-[success=true]:border-transparent dark:data-[success=true]:ring-0",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2.5 shadow-none ring-0 focus:border-transparent focus:ring-0 focus:outline-hidden focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent disabled:shadow-none aria-invalid:border-transparent aria-invalid:ring-0 focus:aria-invalid:border-transparent focus:aria-invalid:ring-0 focus-visible:aria-invalid:border-transparent focus-visible:aria-invalid:ring-0 data-[success=true]:border-transparent data-[success=true]:ring-0 focus:data-[success=true]:border-transparent focus:data-[success=true]:ring-0 dark:bg-transparent dark:focus:border-transparent dark:focus-visible:border-transparent dark:disabled:bg-transparent dark:aria-invalid:border-transparent dark:aria-invalid:ring-0 dark:focus:aria-invalid:border-transparent dark:focus:aria-invalid:ring-0 dark:data-[success=true]:border-transparent dark:data-[success=true]:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
