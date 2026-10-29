import { IconProps } from ".";

export function DownloadIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M15 12v1.875c0 .621-.503 1.125-1.125 1.125h-9.75A1.125 1.125 0 013 13.875V12M9 12V3m-3.47 5.532L9 11.998l3.468-3.466"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
