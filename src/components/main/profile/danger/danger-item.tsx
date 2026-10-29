import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import type { DangerItemProps } from "./types";

export default function DangerItem({
  title,
  description,
  buttonText,
  icon,
  variant = "outline",
  hasDivider = false,
  className,
  onAction,
}: DangerItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 py-4 first:pt-0 sm:flex-row sm:items-center",
        hasDivider && "border-b border-gray-200 pb-4 dark:border-gray-700",
        className,
      )}
    >
      <div>
        <h4 className="mb-1 text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className={cn(
            variant === "danger-outline" &&
              "border-red-300 text-red-500 shadow-theme-xs hover:bg-red-50 hover:text-red-600 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10",
          )}
        >
          {icon}
          <span>{buttonText}</span>
        </Button>
      </div>
    </div>
  );
}
