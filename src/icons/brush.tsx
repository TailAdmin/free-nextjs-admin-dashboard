import { IconProps } from ".";

export function BrushIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M11.041 7.656l3.536-3.535m.353 3.889l1.768-1.768M15.107 18.44L5.561 8.894m-1.59 3.712l7.424 7.425a1.5 1.5 0 002.121 0l7.425-7.425a1.5 1.5 0 000-2.121L13.516 3.06a1.5 1.5 0 00-2.12 0L3.97 10.485a1.5 1.5 0 000 2.121zm2.65 2.652l2.122 2.12-2.475 2.476a1.5 1.5 0 11-2.121-2.121l2.475-2.475z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  );
}
