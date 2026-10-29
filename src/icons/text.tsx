import { IconProps } from ".";

export function TextIcon(props: IconProps) {
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
        d="M9.375 6.667H5.833m8.334 3.334H5.833m5.209 3.333H5.833m-1.25-10h10.834c.69 0 1.25.56 1.25 1.25v10.833c0 .69-.56 1.25-1.25 1.25H4.583c-.69 0-1.25-.56-1.25-1.25V4.584c0-.69.56-1.25 1.25-1.25z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
