import { IconProps } from ".";

export function MicrophoneIcon(props: IconProps) {
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
        d="M10 15.208a5.833 5.833 0 01-5.833-5.833M10 15.208a5.833 5.833 0 005.833-5.833M10 15.208v2.5m-1.667 0h3.334m-1.667-5a3.333 3.333 0 01-3.333-3.333v-3.75a3.333 3.333 0 016.666 0v3.75A3.333 3.333 0 0110 12.708z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
