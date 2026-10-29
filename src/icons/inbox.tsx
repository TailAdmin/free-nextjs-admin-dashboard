import { IconProps } from ".";

export function InboxIcon(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.146 5.625h7.812a3.75 3.75 0 013.75 3.75v5c0 .69-.56 1.25-1.25 1.25H6.146m0-10A3.854 3.854 0 0110 9.48v6.146H3.542c-.69 0-1.25-.56-1.25-1.25V9.48a3.854 3.854 0 013.854-3.854zm5.404 0V3.127m0 0v-.623c0-.345.28-.625.625-.625h1.576a.624.624 0 110 1.248H11.55z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
