import type { IconProps } from ".";

export function FileVideoIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M15.75 13.646v.417l1.915 1.25v-2.917l-1.916 1.25z"
        fill="currentColor"
      />
      <path
        d="M9.581 2.404a1.25 1.25 0 00-.367.254L4.74 7.134a1.25 1.25 0 00-.366.884v8.44c0 .691.56 1.25 1.25 1.25H7.5M15.625 7.5V3.542c0-.69-.56-1.25-1.25-1.25h-4.277c-.18 0-.356.039-.517.112M4.487 7.5h3.847c.69 0 1.25-.56 1.25-1.251l-.003-3.846m1.712 14.184H14.5c.69 0 1.25-.56 1.25-1.25V12.37c0-.69-.56-1.25-1.25-1.25h-3.206c-.69 0-1.25.56-1.25 1.25v2.967c0 .69.56 1.25 1.25 1.25zm4.456-2.942l1.916-1.25v2.917l-1.916-1.25v-.417z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  );
}
