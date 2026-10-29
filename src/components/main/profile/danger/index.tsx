"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import DangerItem from "./danger-item";
import { defaultDangerActions } from "./data";
import type { DangerZoneProps } from "./types";

export default function DangerZone({
  title = "Danger Zone",
  items = defaultDangerActions,
  className,
  onLogout,
  onDelete,
}: DangerZoneProps) {
  const handleAction = (id: string, customOnClick?: () => void) => {
    if (customOnClick) {
      customOnClick();
      return;
    }
    if (id === "logout-all") {
      onLogout?.();
    } else if (id === "delete-account") {
      onDelete?.();
    }
  };

  return (
    <Card
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-700 dark:bg-white/3",
        className,
      )}
    >
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h4>

      <div className="mt-1">
        {items.map((item, index) => (
          <DangerItem
            key={item.id}
            title={item.title}
            description={item.description}
            buttonText={item.buttonText}
            icon={item.icon}
            variant={item.variant}
            hasDivider={index < items.length - 1}
            onAction={() => handleAction(item.id, item.onClick)}
          />
        ))}
      </div>
    </Card>
  );
}

export { DangerZone };
