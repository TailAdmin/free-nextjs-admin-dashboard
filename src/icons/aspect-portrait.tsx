import { IconProps } from ".";

export function AspectPortraitIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M13.5 13.5v-9A1.5 1.5 0 0012 3H6a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 006 15h6a1.5 1.5 0 001.5-1.5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
