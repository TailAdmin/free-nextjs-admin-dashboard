import { IconProps } from ".";

export function LikeIcon(props: IconProps) {
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
        d="M5.07 13.218h6.066a1 1 0 00.977-.79l1.128-5.26a1 1 0 00-.978-1.21H9.988a.667.667 0 01-.66-.57l-.292-2a1 1 0 00-.99-.855H7.23a.333.333 0 00-.333.333v1.687A2 2 0 015.83 6.321l-.762.403m0-.473h-2a.333.333 0 00-.333.334v6.55c0 .183.15.332.333.332h2V6.251z"
        stroke="currentColor"
        strokeOpacity={0.9}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
