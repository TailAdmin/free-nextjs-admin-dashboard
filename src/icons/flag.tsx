import { IconProps } from ".";

export function FlagIcon(props: IconProps) {
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
        d="M9 5.063h5.063l-1.48 3.288c-.132.293-.132.63 0 .923l1.48 3.289h-3.938A1.125 1.125 0 019 11.437v-.562m-5.063 0H9m-5.063-7.5h3.938C8.496 3.375 9 3.879 9 4.5v6.375m-5.063 5.063V2.062"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
