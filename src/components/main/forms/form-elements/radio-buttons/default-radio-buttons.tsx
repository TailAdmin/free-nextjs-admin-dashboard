"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DefaultRadioButtons() {
  const [value, setValue] = useState<string>("option1");

  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => setValue(val as string)}
      className="flex flex-row items-center gap-6"
    >
      <RadioGroupItem value="option1" aria-label="Option 1" />
      <RadioGroupItem value="option2" aria-label="Option 2" />
      <RadioGroupItem
        value="option3"
        disabled
        aria-label="Option 3 (disabled)"
      />
    </RadioGroup>
  );
}
