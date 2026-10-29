import { IconProps } from ".";

export function TaskIcon(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.756 5.501a.75.75 0 01.75-.75h9.992a.75.75 0 01.75.75v9.995a.75.75 0 01-.75.75H8.506a.75.75 0 01-.75-.75V5.5zm.75-2.25a2.25 2.25 0 00-2.25 2.25v.762h-.754a2.25 2.25 0 00-2.25 2.25V18.5a2.25 2.25 0 002.25 2.25h9.986a2.25 2.25 0 002.25-2.25v-.754h.76a2.25 2.25 0 002.25-2.25V5.5a2.25 2.25 0 00-2.25-2.25H8.506zm7.732 14.495H8.506a2.25 2.25 0 01-2.25-2.25V7.763h-.754a.75.75 0 00-.75.75V18.5c0 .414.336.75.75.75h9.986a.75.75 0 00.75-.75v-.754z"
        fill="currentColor"
      />
    </svg>
  );
}
