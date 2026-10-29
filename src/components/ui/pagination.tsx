import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, HorizontalDotsIcon } from "@/icons";
import { cn } from "@/utils";
import * as React from "react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size" | "variant"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  variant,
  onClick,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "default" : (variant ?? "ghost")}
      size={size}
      disabled={disabled}
      className={cn(
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          {...props}
        />
      }
    />
  );
}

function PaginationPrevious({
  className,
  text = "Previous",
  children,
  size = "default",
  variant,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon
            data-icon="inline-start"
            className="rtl:rotate-180"
          />
          {size !== "icon" && <span className="hidden sm:block">{text}</span>}
        </>
      )}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Next",
  children,
  size = "default",
  variant,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={size}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      {children ?? (
        <>
          {size !== "icon" && <span className="hidden sm:block">{text}</span>}
          <ChevronRightIcon data-icon="inline-end" className="rtl:rotate-180" />
        </>
      )}
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center dark:text-white/90 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children ?? <HorizontalDotsIcon />}
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
