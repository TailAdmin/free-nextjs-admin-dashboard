import { IconProps } from ".";

export function FileVideoImg(props: IconProps) {
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
        d="M15.75 13.646l1.915-1.25v2.917l-1.916-1.25v-.417z"
        fill="currentColor"
      />
      <path
        d="M10.043 12.371c0-.69.56-1.25 1.25-1.25H14.5c.69 0 1.25.56 1.25 1.25v2.967c0 .69-.56 1.25-1.25 1.25h-3.206c-.69 0-1.25-.56-1.25-1.25V12.37z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M15.75 13.646l1.915-1.25v2.917l-1.916-1.25v-.417z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.125 18.459v-1.5h-2.25a.75.75 0 01-.75-.75V8.25h3v-.126h.702A2.251 2.251 0 0010.334 6l-.002-2.957h3.793a.75.75 0 01.75.75v4.333h1.5V3.792a2.25 2.25 0 00-2.25-2.25h-3.923a2.25 2.25 0 00-1.592.66L4.284 6.53a2.25 2.25 0 00-.659 1.59v8.088a2.25 2.25 0 002.25 2.25h2.25zM6.185 6.75L8.832 4.1v1.9a.75.75 0 01-.75.75H6.185z"
        fill="currentColor"
      />
    </svg>
  );
}

export { FileVideoImg as FileVideoIcon };
