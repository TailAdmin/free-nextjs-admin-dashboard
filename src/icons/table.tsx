import { IconProps } from ".";

export function TableIcon(props: IconProps) {
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
        d="M3.25 5.5A2.25 2.25 0 015.5 3.25h13a2.25 2.25 0 012.25 2.25v13a2.25 2.25 0 01-2.25 2.25h-13a2.25 2.25 0 01-2.25-2.25v-13zm2.25-.75a.75.75 0 00-.75.75v3.083h14.5V5.5a.75.75 0 00-.75-.75h-13zm13.75 5.333h-3.834v3.833h3.834v-3.833zm-5.334 0h-3.833v3.833h3.833v-3.833zm-5.333 0H4.75v3.833h3.833v-3.833zM4.75 18.5v-3.084h3.833v3.834H5.5a.75.75 0 01-.75-.75zm5.333.75v-3.834h3.833v3.834h-3.833zm5.333 0v-3.834h3.834V18.5a.75.75 0 01-.75.75h-3.084z"
        fill="currentColor"
      />
    </svg>
  );
}
