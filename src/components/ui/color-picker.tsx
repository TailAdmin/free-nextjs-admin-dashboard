'use client';

import type { PopoverContentProps } from '@radix-ui/react-popover';
import {
  type HexColor,
  hexToHsva,
  type HslaColor,
  hslaToHsva,
  type HsvaColor,
  hsvaToHex,
  hsvaToHsla,
  hsvaToHslString,
  hsvaToRgba,
  type RgbaColor,
  rgbaToHsva,
} from '@uiw/color-convert';
import Hue from '@uiw/react-color-hue';
import Saturation from '@uiw/react-color-saturation';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import React from 'react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function getColorAsHsva(color: `#${string}` | HsvaColor | HslaColor | RgbaColor): HsvaColor {
  if (typeof color === 'string') {
    return hexToHsva(color);
  } else if ('h' in color && 's' in color && 'v' in color) {
    return color;
  } else if ('r' in color) {
    return rgbaToHsva(color);
  } else {
    return hslaToHsva(color);
  }
}

type ColorPickerValue = {
  hex: string;
  hsl: HslaColor;
  rgb: RgbaColor;
};

type ColorPickerProps = {
  value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  type?: 'hsl' | 'rgb' | 'hex';
  swatches?: HexColor[];
  hideContrastRatio?: boolean;
  hideDefaultSwatches?: boolean;
  className?: string;
  onValueChange?: (value: ColorPickerValue) => void;
  disableFormatToggle?: boolean;
} & PopoverContentProps;

function ColorPicker({
  value,
  children,
  type = 'hsl',
  swatches = [],
  hideContrastRatio,
  hideDefaultSwatches,
  onValueChange,
  className,
  disableFormatToggle,
  ...props
}: ColorPickerProps) {
  const [colorType, setColorType] = React.useState(type);
  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(value ? getColorAsHsva(value) : { h: 0, s: 0, v: 0, a: 1 });

  React.useEffect(() => {
    if (value) {
      setColorHsv(getColorAsHsva(value));
    }
  }, [value]);

  const handleValueChange = (color: HsvaColor) => {
    onValueChange?.({
      hex: hsvaToHex(colorHsv),
      hsl: hsvaToHsla(colorHsv),
      rgb: hsvaToRgba(colorHsv),
    });

    setColorHsv(color);
  };

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn('w-[350px] p-0', className)}
        {...props}
        style={
          {
            '--selected-color': hsvaToHslString(colorHsv),
          } as React.CSSProperties
        }
      >
        <div className="space-y-2 p-4">
          <Saturation
            hsva={colorHsv}
            onChange={(newColor) => {
              handleValueChange(newColor);
            }}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '4/2',
              borderRadius: '0.3rem',
            }}
            className="border border-border"
          />
          <Hue
            hue={colorHsv.h}
            onChange={(newHue) => {
              handleValueChange({ ...colorHsv, ...newHue });
            }}
            className="[&>div:first-child]:overflow-hidden [&>div:first-child]:!rounded"
            style={
              {
                width: '100%',
                height: '0.9rem',
                borderRadius: '0.3rem',
                '--alpha-pointer-background-color': 'hsl(var(--foreground))',
              } as React.CSSProperties
            }
          />

          <div className="flex items-center gap-2">
            {!disableFormatToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0 justify-between uppercase">
                    {colorType}
                    <ChevronDownIcon className="-me-1 ms-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem checked={colorType === 'hex'} onCheckedChange={() => setColorType('hex')}>
                    HEX
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={colorType === 'hsl'} onCheckedChange={() => setColorType('hsl')}>
                    HSL
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={colorType === 'rgb'} onCheckedChange={() => setColorType('rgb')}>
                    RGB
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="flex grow">
              {colorType === 'hsl' && (
                <ObjectColorInput
                  value={hsvaToHsla(colorHsv)}
                  label="hsl"
                  onValueChange={(value) => {
                    setColorHsv(hslaToHsva(value));
                  }}
                />
              )}
              {colorType === 'rgb' && (
                <ObjectColorInput
                  value={hsvaToRgba(colorHsv)}
                  label="rgb"
                  onValueChange={(value) => {
                    setColorHsv(rgbaToHsva(value));
                  }}
                />
              )}
              {colorType === 'hex' && (
                <Input
                  className="flex"
                  value={hsvaToHex(colorHsv)}
                  onChange={(e) => {
                    setColorHsv(hexToHsva(e.target.value));
                  }}
                />
              )}
            </div>
          </div>
          {swatches.length > 0 || (!hideDefaultSwatches && <Separator />)}
          {!hideDefaultSwatches && (
            <div className="flex flex-wrap justify-start gap-2">
              {['#F8371A', '#F97C1B', '#FAC81C', '#3FD0B6', '#2CADF6', '#6462FC', ...swatches]
                .sort((a, b) => hexToHsva(a).h - hexToHsva(b).h)
                .map((color) => (
                  <button
                    type="button"
                    key={`${color}-swatch`}
                    style={
                      {
                        '--swatch-color': color,
                      } as React.CSSProperties
                    }
                    onClick={() => setColorHsv(hexToHsva(color))}
                    onKeyUp={(e) => (e.key === 'Enter' ? setColorHsv(hexToHsva(color)) : null)}
                    aria-label={`Set color to ${color}`}
                    className="size-5 cursor-pointer rounded bg-[var(--swatch-color)] ring-2 ring-[var(--swatch-color)00] ring-offset-1 ring-offset-background transition-all duration-100 hover:ring-[var(--swatch-color)]"
                  />
                ))}
            </div>
          )}
          {!hideContrastRatio && (
            <>
              <Separator />
              <ContrastRatio color={colorHsv} />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type ContrastRatioProps = {
  color: HsvaColor;
};

function ContrastRatio({ color }: ContrastRatioProps) {
  const [darkModeContrastRatio, setDarkModeContrastValue] = React.useState(0);
  const [lightModeContrastValue, setLightModeContrastValue] = React.useState(0);

  React.useEffect(() => {
    const rgb = hsvaToRgba(color);

    const toSRGB = (c: number) => {
      const channel = c / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const r = toSRGB(rgb.r);
    const g = toSRGB(rgb.g);
    const b = toSRGB(rgb.b);

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const darkModeRatio = (1.0 + 0.05) / (luminance + 0.05);
    const lightModeRatio = (luminance + 0.05) / 0.05;

    setDarkModeContrastValue(Number(darkModeRatio.toFixed(2)));
    setLightModeContrastValue(Number(lightModeRatio.toFixed(2)));
  }, [color]);

  const ValidationBadge = ({
    ratio,
    ratioLimit,
    className,
    children,
    ...props
  }: {
    ratio: number;
    ratioLimit: number;
  } & Omit<BadgeProps, 'variant'>) => (
    <Badge
      variant="outline"
      className={cn(
        'gap-2 rounded-full text-muted-foreground',
        ratio > ratioLimit && 'border-transparent bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
        className,
      )}
      {...props}
    >
      {ratio > 4.5 ? <CheckIcon size={16} /> : <XIcon size={16} />}
      {children}
    </Badge>
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded bg-[var(--selected-color)]">
          <span className="font-medium text-black dark:text-white">A</span>
        </div>
        <div className="flex flex-col justify-between">
          <span className="whitespace-nowrap text-nowrap text-xs text-muted-foreground">Contrast Ratio</span>
          <span className="hidden text-sm dark:flex">{darkModeContrastRatio}</span>
          <span className="text-sm dark:hidden">{lightModeContrastValue}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <ValidationBadge className="dark:hidden" ratio={lightModeContrastValue} ratioLimit={4.5}>
          AA
        </ValidationBadge>
        <ValidationBadge className="dark:hidden" ratio={lightModeContrastValue} ratioLimit={7}>
          AAA
        </ValidationBadge>
        <ValidationBadge className="hidden dark:flex" ratio={darkModeContrastRatio} ratioLimit={4.5}>
          AA
        </ValidationBadge>
        <ValidationBadge className="hidden dark:flex" ratio={darkModeContrastRatio} ratioLimit={7}>
          AAA
        </ValidationBadge>
      </div>
    </div>
  );
}

type ObjectColorInputProps =
  | {
      label: 'hsl';
      value: HslaColor;
      onValueChange?: (value: HslaColor) => void;
    }
  | {
      label: 'rgb';
      value: RgbaColor;
      onValueChange?: (value: RgbaColor) => void;
    };

function ObjectColorInput({ value, label, onValueChange }: ObjectColorInputProps) {
  function handleChange(val: HslaColor | RgbaColor) {
    if (onValueChange) {
      label === 'hsl'
        ? onValueChange({
            ...value,
            ...val,
          })
        : onValueChange({
            ...value,
            ...val,
          });
    }
  }
  return (
    <div className="-mt-px flex">
      <div className="relative min-w-0 flex-1 focus-within:z-10">
        <Input
          className="peer rounded-e-none shadow-none [direction:inherit]"
          value={label === 'hsl' ? value.h.toFixed(0) : value.r}
          onChange={(e) =>
            handleChange({
              ...value,
              [label === 'hsl' ? 'h' : 'r']: e.target.value,
            })
          }
        />
      </div>
      <div className="relative -ms-px min-w-0 flex-1 focus-within:z-10">
        <Input
          className="peer rounded-none shadow-none [direction:inherit]"
          value={label === 'hsl' ? value.s.toFixed(0) : value.g}
          onChange={(e) =>
            handleChange({
              ...value,
              [label === 'hsl' ? 's' : 'g']: e.target.value,
            })
          }
        />
      </div>
      <div className="relative -ms-px min-w-0 flex-1 focus-within:z-10">
        <Input
          className="peer rounded-s-none shadow-none [direction:inherit]"
          value={label === 'hsl' ? value.l.toFixed(0) : value.b}
          onChange={(e) =>
            handleChange({
              ...value,
              [label === 'hsl' ? 'l' : 'b']: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

export { ColorPicker };
export type { ColorPickerProps, ColorPickerValue };
