import { IconProps } from ".";

export function DislikeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M5.07 2.782h6.066a1 1 0 01.977.79l1.128 5.26a1 1 0 01-.978 1.21H9.988a.667.667 0 00-.66.57l-.292 2a1 1 0 01-.99.855H7.23a.333.333 0 01-.333-.333v-1.687A2 2 0 005.83 9.679l-.762-.403m0 .473h-2a.333.333 0 01-.333-.333v-6.55c0-.184.15-.333.333-.333h2v7.216z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
