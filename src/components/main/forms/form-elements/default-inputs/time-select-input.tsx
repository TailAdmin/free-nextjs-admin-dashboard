"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TimeIcon } from "@/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

export default function TimeSelectInput() {
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timeFp: flatpickr.Instance | undefined;

    if (timeInputRef.current) {
      timeFp = flatpickr(timeInputRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
      });
    }

    return () => {
      timeFp?.destroy();
    };
  }, []);

  return (
    <Field>
      <FieldLabel>Time Select Input</FieldLabel>
      <div className="relative">
        <Input
          ref={timeInputRef}
          type="text"
          placeholder="12:00 AM"
          className="pe-10"
        />
        <span className="pointer-events-none absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <TimeIcon className="size-5" />
        </span>
      </div>
    </Field>
  );
}
