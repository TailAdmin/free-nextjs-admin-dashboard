import { SVGProps } from "react";

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M5.0625 5.99976L2.0625 9.00003L5.0625 12M12.9375 5.99976L15.9375 9.00003L12.9375 12M10.3329 2.99994L7.66626 14.9999"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
