import { IconProps } from ".";

export function ListIcon(props: IconProps) {
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
        d="M5.5 3.25A2.25 2.25 0 003.25 5.5v13a2.25 2.25 0 002.25 2.25h13a2.25 2.25 0 002.25-2.25v-13a2.25 2.25 0 00-2.25-2.25h-13zM4.75 5.5a.75.75 0 01.75-.75h13a.75.75 0 01.75.75v13a.75.75 0 01-.75.75h-13a.75.75 0 01-.75-.75v-13zm1.5 4.214a.75.75 0 01.75-.75h10a.75.75 0 110 1.5H7a.75.75 0 01-.75-.75zm0 4.572a.75.75 0 01.75-.75h10a.75.75 0 110 1.5H7a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}
