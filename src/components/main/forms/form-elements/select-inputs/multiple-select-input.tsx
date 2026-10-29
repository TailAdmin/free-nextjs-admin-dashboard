"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "@/icons";

const colorOptions = [
  { value: "Blue", label: "Blue" },
  { value: "Green", label: "Green" },
  { value: "Red", label: "Red" },
  { value: "Yellow", label: "Yellow" },
  { value: "Purple", label: "Purple" },
  { value: "Orange", label: "Orange" },
];

export default function MultipleSelectInput() {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "Blue",
    "Green",
  ]);

  const handleRemove = (valueToRemove: string) => {
    setSelectedValues((prev) => prev.filter((val) => val !== valueToRemove));
  };

  return (
    <Field>
      <FieldLabel>Multiple Select Options</FieldLabel>
      <Select
        multiple
        value={selectedValues}
        onValueChange={(val) => setSelectedValues(val as string[])}
      >
        <SelectTrigger
          render={<div />}
          nativeButton={false}
          className="h-auto min-h-11 cursor-pointer py-1.5 ps-3 pe-3.5"
        >
          <SelectValue placeholder="Select Option">
            {(values: string[]) => {
              if (!values || values.length === 0) return null;
              return (
                <div className="flex flex-wrap items-center gap-2">
                  {values.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 py-1 ps-2.5 pe-1.5 text-sm font-normal text-gray-800 dark:border-gray-800 dark:bg-white/5 dark:text-white/90"
                    >
                      <span>{val}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${val}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(val);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                          }
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        className="inline-flex size-3.5 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              );
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
