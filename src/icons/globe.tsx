import { IconProps } from ".";

export function GlobeIcon(props: IconProps) {
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
        d="M12.001 2.75a9.25 9.25 0 019.25 9.25A9.25 9.25 0 0112 21.25m0-18.5A9.25 9.25 0 002.751 12a9.25 9.25 0 009.25 9.25m0-18.5c2.209 0 4 4.141 4 9.25 0 5.107-1.791 9.25-4 9.25m0-18.5c-2.209 0-3.999 4.141-3.999 9.25 0 5.107 1.79 9.25 3.999 9.25M3.246 9h17.508M3.246 15h17.508"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
