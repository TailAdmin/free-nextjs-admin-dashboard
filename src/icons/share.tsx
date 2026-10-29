import { IconProps } from ".";

export function ShareIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M9.5 1.833L14.167 6.5 9.5 11.167v-3.05a7.67 7.67 0 00-7.496 6.05A7.667 7.667 0 019.5 4.883v-3.05z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
