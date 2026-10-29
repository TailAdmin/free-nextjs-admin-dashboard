"use client";

import { cn } from "@/utils";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-gray-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
