import { IconProps } from ".";

export function DiamondIcon(props: IconProps) {
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
        d="M14.034 3.333H5.966a1.25 1.25 0 00-1.108.672l-1.76 3.372a1.25 1.25 0 00.158 1.39l6.744 7.9 6.744-7.9a1.25 1.25 0 00.157-1.39l-1.759-3.372a1.25 1.25 0 00-1.108-.672z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.083 7.287h5.834"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
