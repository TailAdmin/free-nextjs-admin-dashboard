import { IconProps } from ".";

export function EyeIcon(props: IconProps) {
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
        d="M10 4.375c-3.34 0-6.218 1.98-7.534 4.833a1.893 1.893 0 000 1.585C3.782 13.646 6.66 15.625 10 15.625s6.218-1.98 7.535-4.832a1.893 1.893 0 000-1.585C16.218 6.354 13.34 4.375 10 4.375zM13.02 10a3.02 3.02 0 11-6.04 0 3.02 3.02 0 016.04 0z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  );
}
