"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, useId, useMemo } from "react";

interface FieldContextValue {
  id: string;
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined);

function useField() {
  return useContext(FieldContext);
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium text-gray-800 data-[variant=label]:text-sm data-[variant=legend]:text-base dark:text-white/90",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-red-500 dark:data-[invalid=true]:text-red-400",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldVariants> {
  controlId?: string;
}

function Field({
  className,
  orientation = "vertical",
  controlId,
  id: divId,
  children,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const id = controlId ?? generatedId;
  const contextValue = useMemo(() => ({ id }), [id]);

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        role="group"
        id={divId}
        data-slot="field"
        data-orientation={orientation}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<typeof Label>) {
  const field = useField();
  const resolvedHtmlFor = htmlFor ?? field?.id;

  return (
    <Label
      data-slot="field-label"
      htmlFor={resolvedHtmlFor}
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 text-sm leading-snug font-medium text-gray-700 select-none group-data-[disabled=true]/field:opacity-50 dark:text-gray-300",
        "has-data-checked:border-brand-500/30 has-data-checked:bg-brand-500/5 dark:has-data-checked:border-brand-500/20 dark:has-data-checked:bg-brand-500/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-[10px] has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-gray-200 dark:has-[>[data-slot=field]]:border-gray-800",
        "has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-gray-50/60 dark:has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-white/2",
        "has-[>[data-slot=field]]:has-focus-visible:border-brand-300 has-[>[data-slot=field]]:has-focus-visible:ring-3 has-[>[data-slot=field]]:has-focus-visible:ring-brand-500/20 dark:has-[>[data-slot=field]]:has-focus-visible:border-brand-500/40",
        "*:data-[slot=field]:p-2.5",
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium text-gray-700 group-data-[disabled=true]/field:opacity-50 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-start text-sm leading-normal font-normal text-gray-500 group-has-data-horizontal/field:text-balance dark:text-gray-400 [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:text-gray-700 [&>a]:underline [&>a]:underline-offset-4 dark:[&>a]:text-gray-300 [&>a:hover]:text-brand-500 dark:[&>a:hover]:text-brand-400",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-sm font-normal text-red-500 dark:text-red-400",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContext,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  useField,
};
