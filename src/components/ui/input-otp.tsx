"use client";

import { useField } from "@/components/ui/field";
import { MinusIcon } from "@/icons";
import { cn } from "@/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

function InputOTP({
  className,
  containerClassName,
  id,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  const field = useField();
  const resolvedId = id ?? field?.id;

  return (
    <OTPInput
      id={resolvedId}
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-[10px] has-aria-invalid:border-red-500 has-aria-invalid:ring-3 has-aria-invalid:ring-red-500/20 data-[success=true]:border-green-500 data-[success=true]:ring-3 data-[success=true]:ring-green-500/20 has-data-[success=true]:border-green-500 has-data-[success=true]:ring-3 has-data-[success=true]:ring-green-500/20 dark:has-aria-invalid:border-red-500/50 dark:has-aria-invalid:ring-red-500/40 dark:data-[success=true]:border-green-500/50 dark:data-[success=true]:ring-green-500/40 dark:has-data-[success=true]:border-green-500/50 dark:has-data-[success=true]:ring-green-500/40",
        className,
      )}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-11 items-center justify-center border-y border-e border-gray-300 bg-white text-base font-semibold text-gray-800 shadow-theme-xs outline-hidden transition-colors first:rounded-s-[10px] first:border-s last:rounded-e-[10px] data-[active=true]:z-10 data-[active=true]:border-brand-300 data-[active=true]:ring-3 data-[active=true]:ring-brand-500/20 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 data-[active=true]:aria-invalid:border-red-500 data-[active=true]:aria-invalid:ring-red-500/20 data-[success=true]:border-green-500 data-[success=true]:ring-3 data-[success=true]:ring-green-500/20 data-[active=true]:data-[success=true]:border-green-500 data-[active=true]:data-[success=true]:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:data-[active=true]:border-brand-500/40 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 dark:data-[active=true]:aria-invalid:border-red-500/50 dark:data-[active=true]:aria-invalid:ring-red-500/40 dark:data-[success=true]:border-green-500/50 dark:data-[success=true]:ring-green-500/40 dark:data-[active=true]:data-[success=true]:border-green-500/50 dark:data-[active=true]:data-[success=true]:ring-green-500/40",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px bg-gray-800 duration-1000 animate-caret-blink dark:bg-white/90" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-1 text-gray-400 dark:text-gray-500 [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
