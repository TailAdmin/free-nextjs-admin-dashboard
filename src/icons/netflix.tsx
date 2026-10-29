import { IconProps } from ".";

export function NetflixIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_7491_271436)">
        <path
          d="M7.515 0H4.07v18c1.13-.268 2.31-.402 3.445-.452V0z"
          fill="#C20000"
        />
        <path
          d="M7.515 0H4.07v13.773c1.13-.268 2.31-.402 3.445-.452V0z"
          fill="url(#paint0_linear_7491_271436)"
        />
        <path
          d="M13.93 18V0h-3.445v17.584c2.011.128 3.445.416 3.445.416z"
          fill="#C20000"
        />
        <path
          d="M13.93 18V6.054h-3.445v11.53c2.011.128 3.445.416 3.445.416z"
          fill="url(#paint1_linear_7491_271436)"
        />
        <path
          d="M13.93 18L7.515 0H4.07l6.263 17.575c2.091.122 3.597.425 3.597.425z"
          fill="#FA0000"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_7491_271436"
          x1={3.45535}
          y1={8.42411}
          x2={6.01945}
          y2={6.48893}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C20000" stopOpacity={0} />
          <stop offset={1} stopColor="#9D0000" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7491_271436"
          x1={14.4293}
          y1={11.1013}
          x2={12.1071}
          y2={12.0689}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C20000" stopOpacity={0} />
          <stop offset={1} stopColor="#9D0000" />
        </linearGradient>
        <clipPath id="clip0_7491_271436">
          <path fill="#fff" d="M0 0H18V18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
