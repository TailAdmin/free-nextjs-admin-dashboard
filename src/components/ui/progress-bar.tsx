"use client";

import { cn } from "@/utils";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import * as React from "react";

function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  const hasChildren = React.Children.toArray(children).some((child) =>
    React.isValidElement(child),
  );

  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap items-center gap-2.5", className)}
      {...props}
    >
      {children}
      {!hasChildren && (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1.5 flex-1 items-center overflow-hidden rounded-xs bg-gray-200 dark:bg-gray-800",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full rounded-xs bg-linear-to-r rtl:bg-linear-to-l from-brand-300 to-brand-600 transition-all duration-300 ease-in-out",
        className,
      )}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn(
        "text-sm font-medium text-gray-700 dark:text-gray-300",
        className,
      )}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ms-auto text-sm font-medium text-gray-500 tabular-nums dark:text-gray-400",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue
};

