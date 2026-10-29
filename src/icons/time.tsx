import { IconProps } from ".";

export function TimeIcon(props: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.042 10a6.958 6.958 0 1113.916 0 6.958 6.958 0 01-13.916 0zM10 1.542a8.458 8.458 0 100 16.916 8.458 8.458 0 000-16.916zm0 9.208a.75.75 0 01-.75-.75V5.417a.75.75 0 011.5 0V9.25h2.583a.75.75 0 010 1.5H10z"
        fill="currentColor"
      />
    </svg>
  );
}
