import { cn } from "@/utils";
import { IconProps } from ".";

export function FluxIcon({ className, ...props }: IconProps) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#1D2939] dark:text-white/90", className)}
      {...props}
    >
      <path
        d="M12.64 8.117h-1.817L9.006 5.565l-5.67 7.952h1.821l3.849-5.4h1.817l-3.848 5.4H8.8l3.84-5.4 4.904 6.881h-2.87v-1.475l-2.034-2.854-2.024 2.849v1.48H.455l8.55-11.996 3.636 5.115z"
        fill="currentColor"
      />
    </svg>
  );
}
