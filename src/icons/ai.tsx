import { IconProps } from ".";

export function AiIcon(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.75 2.43v5.274m-9.327 5.969A3.287 3.287 0 0012 14.916a3.287 3.287 0 002.578-1.243M20 12v6.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5V12a8 8 0 1116 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 2.43v.01M9.504 9.875v.01m4.992-.01v.01"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
