import { IconProps } from ".";

export function ClockIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M13.333 10H10V5.415m7.708 4.583a7.708 7.708 0 11-15.416 0 7.708 7.708 0 0115.416 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
