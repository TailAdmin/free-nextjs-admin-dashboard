import { cn } from "@/utils";
import { InfoFieldProps } from "./types";

export default function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:gap-2", className)}>
      <p className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-white/90">
        {value || "—"}
      </p>
    </div>
  );
}
