import { IconProps } from ".";

export function MuteIcon(props: IconProps) {
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
        d="M14.28 6.945c1.136 1.266 1.42 3.122.85 4.682m-2.594-3.168c.294.327.478.718.552 1.125M2.292 2.291l3.934 3.934m0 0l4.19 4.19 7.292 7.292M6.226 6.225l-.731.65H3.542c-.69 0-1.25.559-1.25 1.25v3.75c0 .69.56 1.25 1.25 1.25h1.953l2.841 2.525c.806.716 2.08.144 2.08-.934v-4.3M8.079 4.578l.258-.23c.806-.716 2.08-.144 2.08.935V6.91"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
