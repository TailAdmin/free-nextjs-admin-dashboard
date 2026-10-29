"use client";

import { cn } from "@/utils";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

export interface SliderProps extends SliderPrimitive.Root.Props {
  dir?: "ltr" | "rtl";
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbAlignment = "center",
  dir,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  const slider = (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment={thumbAlignment}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex h-5 w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 dark:bg-gray-800"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full rounded-full bg-brand-500 select-none data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="block size-5 shrink-0 rounded-full border-2 border-brand-500 bg-white shadow-theme-xs transition-[box-shadow,transform] duration-150 select-none after:absolute after:-inset-2 after:content-[''] hover:ring-4 hover:ring-brand-500/15 focus-visible:ring-4 focus-visible:ring-brand-500/20 focus-visible:outline-hidden active:scale-95 active:ring-4 active:ring-brand-500/20 disabled:pointer-events-none disabled:border-gray-400 disabled:opacity-50 dark:border-brand-500 dark:bg-white dark:disabled:border-gray-600"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );

  if (dir) {
    return <DirectionProvider direction={dir}>{slider}</DirectionProvider>;
  }

  return slider;
}

export { Slider };
