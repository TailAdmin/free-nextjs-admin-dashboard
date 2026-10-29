import { IconProps } from ".";

export function LayerIcon(props: IconProps) {
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
        d="M4.187 11.329l-1.57.563a.481.481 0 000 .906l6.895 2.472c.316.113.66.113.975 0l6.895-2.472a.481.481 0 000-.906l-1.563-.56M9.512 4.728L2.617 7.201a.481.481 0 000 .906l6.895 2.472c.316.113.66.113.975 0l6.895-2.472a.481.481 0 000-.906l-6.895-2.472a1.444 1.444 0 00-.975 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
