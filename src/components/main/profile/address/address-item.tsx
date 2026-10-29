import { cn } from "@/utils";
import { AddressItemProps } from "./types";

export default function AddressItem({
  label,
  value,
  className,
}: AddressItemProps) {
  return (
    <div className={cn(className)}>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}
