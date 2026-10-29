import { IconProps } from ".";

export function PluginIcon(props: IconProps) {
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
        d="M14 2.75a.75.75 0 011.5 0v2.983H19a.75.75 0 010 1.5h-.5v5a6.501 6.501 0 01-5.75 6.457v2.56a.75.75 0 01-1.5 0v-2.56a6.501 6.501 0 01-5.75-6.457v-5H5a.75.75 0 010-1.5h3.5V2.75a.75.75 0 011.5 0v2.983h4V2.75zM7 7.233v5a5 5 0 0010 0v-5H7z"
        fill="currentColor"
      />
    </svg>
  );
}
