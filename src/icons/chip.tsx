import { IconProps } from ".";

export function ChipIcon(props: IconProps) {
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
        d="M6.667 2.291v2.083m-4.375 8.959h2.083m2.292 2.291v2.084m8.958-4.375h2.083M10 2.29v2.083M2.292 10h2.083M10 15.624v2.084m5.625-7.709h2.083m-4.375-7.708v2.083M2.292 6.666h2.083m8.958 8.958v2.084m2.292-11.042h2.083M5.625 15.624h8.75c.69 0 1.25-.56 1.25-1.25v-8.75c0-.69-.56-1.25-1.25-1.25h-8.75c-.69 0-1.25.56-1.25 1.25v8.75c0 .69.56 1.25 1.25 1.25z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
