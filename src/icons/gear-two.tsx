import { IconProps } from ".";

export function GearTwoIcon(props: IconProps) {
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
        d="M9.375 2.46a1.25 1.25 0 011.25 0l5.592 3.229c.387.223.625.636.625 1.082v6.458c0 .446-.238.859-.625 1.082l-5.592 3.229a1.25 1.25 0 01-1.25 0L3.783 14.31a1.25 1.25 0 01-.625-1.082V6.77c0-.446.238-.859.625-1.082L9.375 2.46z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.57 10a2.57 2.57 0 11-5.142 0 2.57 2.57 0 015.142 0z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
