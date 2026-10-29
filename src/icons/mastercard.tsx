import { IconProps } from ".";

export function MastercardIcon(props: IconProps) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10" cy="16" r="9" fill="#E80B26" />
      <circle cx="22" cy="16" r="9" fill="#F59D31" />
      <path
        d="M16 22.7085C17.8413 21.0605 19 18.6658 19 16.0002C19 13.3347 17.8413 10.9399 16 9.29199C14.1587 10.9399 13 13.3347 13 16.0002C13 18.6658 14.1587 21.0605 16 22.7085Z"
        fill="#FC6020"
      />
    </svg>
  );
}
