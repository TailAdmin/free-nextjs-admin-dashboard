import { IconProps } from ".";

export function VerticalDotsIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
