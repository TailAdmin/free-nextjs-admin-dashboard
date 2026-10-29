import { IconProps } from ".";

export function CallIcon(props: IconProps) {
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
        d="M20 17.052V12a8 8 0 10-16 0v5.052m16-3.011v5.709a1.5 1.5 0 01-1.5 1.5H14m-7.5-2.5h-1a1.5 1.5 0 01-1.5-1.5v-3.5a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v3.5a1.5 1.5 0 01-1.5 1.5zm11 0h1a1.5 1.5 0 001.5-1.5v-3.5a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5v3.5a1.5 1.5 0 001.5 1.5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
