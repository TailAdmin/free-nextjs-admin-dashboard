import { IconProps } from ".";

export function QwenIcon(props: IconProps) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_6739_42533)">
        <path
          d="M18 11.285L15.622 7.11l1.254-2.133a.59.59 0 000-.577l-1.253-2.134a.362.362 0 00-.318-.187h-4.632L9.606.187A.362.362 0 009.288 0H6.814a.362.362 0 00-.318.187L4.121 4.36H1.647a.362.362 0 00-.318.186L.075 6.681a.59.59 0 000 .577l2.122 3.873-1.068 1.892a.59.59 0 000 .577l1.254 2.134a.362.362 0 00.317.187h4.632l1.069 1.892a.362.362 0 00.317.187h2.474a.362.362 0 00.318-.187l2.376-4.173h2.121a.362.362 0 00.318-.187l1.254-2.134a.59.59 0 000-.577l.42.543z"
          fill="url(#paint0_radial_6739_42533)"
        />
        <path
          d="M11.192 18H8.72l-1.386-2.265H2.7l1.42-2.267h2.376L1.329 4.673h2.792L6.814.187l1.254 2.267-1.254 2.219h9.567l-1.253 2.134 2.375 4.174h-2.375l-1.242-2.22L9 18.001h2.192z"
          fill="#fff"
        />
        <path
          d="M12.26 7.707H5.94L9 12.937l3.26-5.23z"
          fill="url(#paint1_radial_6739_42533)"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_6739_42533"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 12.3703 -12.2216 0 8.855 10.203)"
        >
          <stop stopColor="#665CEE" />
          <stop offset={1} stopColor="#332E91" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_6739_42533"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 12.3703 -12.2216 0 8.855 10.202)"
        >
          <stop stopColor="#665CEE" />
          <stop offset={1} stopColor="#332E91" />
        </radialGradient>
        <clipPath id="clip0_6739_42533">
          <path fill="#fff" d="M0 0H18V18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
