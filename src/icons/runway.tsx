import { cn } from "@/utils";
import { IconProps } from ".";

export function RunwayIcon({ className, ...props }: IconProps) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#000000] dark:text-white", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.462 14.952c-1.814.166-3.322-1.956-4.485-3.028C6.39 16.152 0 15.757 0 11.463V3.5C0 2.875.166 2.236.498 1.7 1.112.664 2.3-.013 3.501 0h7.961c4.294 0 4.704 6.39.46 6.964l2.02 2.006c2.21 2.083.55 6.07-2.479 5.98v.002zm-.97-2.53c1.252 1.29 3.245-.703 1.955-1.955l-3.49-3.49H7.004v1.956l3.015 3.016.474.473zm-8.37-.972c-.026 1.79 2.798 1.79 2.76 0V3.49c.025-.895-.92-1.598-1.776-1.33-.04.013-.077.025-.102.038a1.399 1.399 0 00-.896 1.316v7.936h.013zm9.34-6.58c1.79.024 1.79-2.787 0-2.76h-4.74c.357.753.268 1.941.28 2.76h4.46z"
        fill="currentColor"
      />
    </svg>
  );
}
