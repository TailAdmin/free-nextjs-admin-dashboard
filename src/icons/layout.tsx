import { IconProps } from ".";

export function LayoutIcon(props: IconProps) {
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
        d="M9.333 9.333V20M20 9.333H4M5.5 20h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0018.5 4h-13A1.5 1.5 0 004 5.5v13A1.5 1.5 0 005.5 20z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
