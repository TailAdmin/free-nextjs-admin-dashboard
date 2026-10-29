import { IconProps } from ".";

export function TagIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 5.25C1.5 4.007 2.507 3 3.75 3h6.398c.597 0 1.169.237 1.591.66l3.1 3.1a1.75 1.75 0 010 2.48l-3.1 3.1a2.25 2.25 0 01-1.591.66H3.75C2.507 13 1.5 11.993 1.5 10.75v-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}
