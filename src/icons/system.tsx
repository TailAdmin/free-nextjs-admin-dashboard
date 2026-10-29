import { IconProps } from ".";

export function SystemIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <circle
        cx={9.99998}
        cy={9.99913}
        r={8.34678}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <mask id="a" fill="#fff">
        <path d="M10 16.05c0 .553.45 1.008.997.93a7.051 7.051 0 000-13.96c-.547-.078-.997.377-.997.93v12.1z" />
      </mask>
      <path
        d="M10 16.05c0 .553.45 1.008.997.93a7.051 7.051 0 000-13.96c-.547-.078-.997.377-.997.93v12.1z"
        stroke="currentColor"
        strokeWidth={3}
        mask="url(#a)"
      />
    </svg>
  );
}
