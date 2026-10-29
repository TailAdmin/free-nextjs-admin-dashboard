"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

export default function LabeledCheckbox() {
  const [isCheckedDefault, setIsCheckedDefault] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  return (
    <div className="flex flex-wrap items-center gap-6 sm:gap-8">
      <Field orientation="horizontal" className="w-auto gap-2.5">
        <Checkbox
          id="checkbox-default"
          checked={isCheckedDefault}
          onCheckedChange={setIsCheckedDefault}
        />
        <Label
          htmlFor="checkbox-default"
          className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Default
        </Label>
      </Field>

      <Field orientation="horizontal" className="w-auto gap-2.5">
        <Checkbox
          id="checkbox-checked"
          checked={isChecked}
          onCheckedChange={setIsChecked}
        />
        <Label
          htmlFor="checkbox-checked"
          className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Checked
        </Label>
      </Field>

      <Field orientation="horizontal" className="w-auto gap-2.5">
        <Checkbox
          id="checkbox-disabled"
          defaultChecked
          disabled
        />
        <Label
          htmlFor="checkbox-disabled"
          className="cursor-not-allowed text-sm font-medium text-gray-400 dark:text-gray-600"
        >
          Disabled
        </Label>
      </Field>
    </div>
  );
}
