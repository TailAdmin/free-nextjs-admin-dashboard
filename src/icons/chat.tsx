import { IconProps } from ".";

export function ChatIcon(props: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12.096a8 8 0 118 8H5.06l1.283-1.283a.75.75 0 000-1.06A7.973 7.973 0 014 12.096zm8-9.5a9.5 9.5 0 00-7.227 15.666L2.72 20.315a.75.75 0 00.53 1.28H12a9.5 9.5 0 000-19zm-4.375 8.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm3.125 1.25a1.25 1.25 0 111.25 1.25c-.69 0-1.25-.559-1.25-1.25zm5.625-1.25a1.25 1.25 0 000 2.5 1.25 1.25 0 000-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}
