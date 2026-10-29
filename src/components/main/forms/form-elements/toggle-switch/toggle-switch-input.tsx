"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function ToggleSwitchInput() {
  const [activeSwitch, setActiveSwitch] = useState(true);
  const [inactiveSwitch, setInactiveSwitch] = useState(false);

  return (
    <div className="flex items-center gap-7">
      <Switch
        size="sm"
        checked={activeSwitch}
        onCheckedChange={setActiveSwitch}
        aria-label="Active switch"
      />
      <Switch
        size="sm"
        checked={inactiveSwitch}
        onCheckedChange={setInactiveSwitch}
        aria-label="Inactive switch"
      />
    </div>
  );
}
