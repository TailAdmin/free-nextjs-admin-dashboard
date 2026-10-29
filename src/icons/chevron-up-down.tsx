import { IconProps } from ".";

export function ChevronUpDownIcon(props: IconProps) {
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
        d="M12.167 6.242L8 2.076 3.833 6.242m0 3.515L8 13.924l4.167-4.167"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
