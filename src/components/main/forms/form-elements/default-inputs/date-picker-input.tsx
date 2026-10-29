"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

export default function DatePickerInput() {
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let dateFp: flatpickr.Instance | undefined;

    if (dateInputRef.current) {
      dateFp = flatpickr(dateInputRef.current, {
        mode: "single",
        dateFormat: "m/d/Y",
      });
    }

    return () => {
      dateFp?.destroy();
    };
  }, []);

  return (
    <Field>
      <FieldLabel>Date Picker Input</FieldLabel>
      <div className="relative">
        <Input
          ref={dateInputRef}
          type="text"
          placeholder="mm/dd/yyy"
          className="pe-10"
        />
        <span className="pointer-events-none absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <CalendarIcon className="size-5" />
        </span>
      </div>
    </Field>
  );
}
