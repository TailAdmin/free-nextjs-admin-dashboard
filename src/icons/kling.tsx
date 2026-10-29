import { IconProps } from ".";

export function KlingIcon(props: IconProps) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_6739_42504)">
        <path
          d="M4.06 10.331c.38-1.163.882-2.283 1.498-3.341 2.377-4.119 5.846-6.568 7.747-5.47C9.03-.95 3.45.708.842 5.223a10.034 10.034 0 00-.778 1.692c-.194.554.069 1.15.577 1.445l3.418 1.972z"
          fill="url(#paint0_radial_6739_42504)"
        />
        <path
          d="M13.941 7.623a17.39 17.39 0 01-1.5 3.341c-2.377 4.12-5.845 6.569-7.747 5.47 4.278 2.47 9.858.812 12.465-3.703.31-.538.571-1.104.777-1.691.195-.553-.069-1.15-.577-1.444L13.94 7.624z"
          fill="url(#paint1_radial_6739_42504)"
        />
        <path
          d="M12.443 10.965c2.377-4.119 2.764-8.347.862-9.445-1.9-1.097-5.368 1.353-7.747 5.47 1.555-2.692 4.356-3.986 6.258-2.889 1.9 1.098 2.18 4.17.626 6.863v.001z"
          fill="url(#paint2_linear_6739_42504)"
        />
        <path
          d="M5.557 6.99c-2.377 4.12-2.764 8.348-.862 9.445 1.9 1.098 5.37-1.351 7.748-5.47-1.556 2.693-4.357 3.986-6.259 2.889-1.9-1.098-2.18-4.17-.626-6.863z"
          fill="url(#paint3_linear_6739_42504)"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_6739_42504"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(5.60828 -9.38264 12.85776 7.68546 3.88 10.228)"
        >
          <stop offset={0.095} stopColor="#FFF959" />
          <stop offset={0.326} stopColor="#0DF35E" />
          <stop offset={0.64} stopColor="#0BF2F9" />
          <stop offset={1} stopColor="#04A6F0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_6739_42504"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(120.868 4.868 7.868) scale(10.931 14.9796)"
        >
          <stop offset={0.095} stopColor="#FFF959" />
          <stop offset={0.326} stopColor="#0DF35E" />
          <stop offset={0.64} stopColor="#0BF2F9" />
          <stop offset={1} stopColor="#04A6F0" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_6739_42504"
          x1={11.6836}
          y1={1.34877}
          x2={13.5466}
          y2={7.39602}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#003EFF" />
          <stop offset={1} stopColor="#0BFFE7" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_6739_42504"
          x1={6.31645}
          y1={16.6067}
          x2={4.45345}
          y2={10.5595}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#003EFF" />
          <stop offset={1} stopColor="#0BFFE7" />
        </linearGradient>
        <clipPath id="clip0_6739_42504">
          <path fill="#fff" d="M0 0H18V18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
