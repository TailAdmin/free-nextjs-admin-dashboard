import { IconProps } from ".";

export function HourglassIcon(props: IconProps) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.66667 4.66667H23.3333M4.66667 23.3333L23.3333 23.3333M21 4.66667V7.00002C21 10.866 17.866 14 14 14M7 4.66667V7.00002C7 10.866 10.134 14 14 14M14 14C17.866 14 21 17.134 21 21V23.3333M14 14C10.134 14 7 17.134 7 21L7 23.3333"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
