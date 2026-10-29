import { IconProps } from ".";

export function ArchiveIcon(props: IconProps) {
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
        d="M2.5 6.25V15.5C2.5 16.3284 3.17157 17 4 17H16C16.8284 17 17.5 16.3284 17.5 15.5V6.25M8.33333 10H11.6667M1.66667 3.75C1.66667 3.05964 2.22631 2.5 2.91667 2.5H17.0833C17.7737 2.5 18.3333 3.05964 18.3333 3.75V5C18.3333 5.69036 17.7737 6.25 17.0833 6.25H2.91667C2.22631 6.25 1.66667 5.69036 1.66667 5V3.75Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
