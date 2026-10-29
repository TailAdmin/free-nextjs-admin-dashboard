import { IconProps } from ".";

export function KeyIcon(props: IconProps) {
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
        d="M13.975 3.334l2.578.114.114 2.578-5.517 5.517A3.99 3.99 0 118.458 8.85l1.115-1.115h.951c.69 0 1.25-.56 1.25-1.25v-.951h.951c.69 0 1.25-.56 1.25-1.25v-.951z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.512 13.073a.293.293 0 01.413.413.292.292 0 01-.413-.413z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
