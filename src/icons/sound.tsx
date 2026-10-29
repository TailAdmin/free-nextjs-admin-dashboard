import { IconProps } from ".";

export function SoundIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M14.28 6.946c1.514 1.687 1.514 4.421 0 6.108M12.535 8.46a2.306 2.306 0 010 3.08m-4.2-7.19L5.495 6.874H3.542c-.69 0-1.25.56-1.25 1.25v3.75c0 .69.56 1.25 1.25 1.25h1.953l2.841 2.526c.806.716 2.08.144 2.08-.934V5.284c0-1.079-1.274-1.651-2.08-.935z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
