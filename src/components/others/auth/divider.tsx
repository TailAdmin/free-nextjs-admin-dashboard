import { cn } from "@/utils";

export interface AuthDividerProps {
  label?: string;
  className?: string;
}

export default function AuthDivider({
  label = "Or",
  className,
}: AuthDividerProps) {
  return (
    <div className={cn("relative py-3 sm:py-5", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-800" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white p-2 text-gray-400 sm:px-5 sm:py-2 dark:bg-gray-900">
          {label}
        </span>
      </div>
    </div>
  );
}
