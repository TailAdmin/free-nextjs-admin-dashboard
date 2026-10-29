import { IconProps } from ".";

export function UserCircleIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M17.775 19.107v-.261a4.5 4.5 0 00-4.5-4.5h-2.55a4.5 4.5 0 00-4.5 4.5v.261M21.25 12a9.25 9.25 0 11-18.5 0 9.25 9.25 0 0118.5 0zm-6.483-2.732a2.768 2.768 0 11-5.536 0 2.768 2.768 0 015.536 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
