"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function DefaultCheckbox() {
  const [isCheckedOne, setIsCheckedOne] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);

  return (
    <div className="flex flex-row items-center gap-6">
      <Checkbox
        checked={isCheckedOne}
        onCheckedChange={setIsCheckedOne}
        aria-label="Default unchecked checkbox"
      />
      <Checkbox
        checked={isCheckedTwo}
        onCheckedChange={setIsCheckedTwo}
        aria-label="Checked checkbox"
      />
      <Checkbox
        defaultChecked
        disabled
        aria-label="Disabled checked checkbox"
      />
    </div>
  );
}
