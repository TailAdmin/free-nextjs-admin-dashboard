import { IconProps } from ".";

export function ShootingStarIcon(props: IconProps) {
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
        d="M14.63 4.095l1.499-1.5m3.492 4.993l1.5-1.5m-4.62.38l4.395-4.396m-9.734 2.145l2.6 5.266 5.811.845-4.206 4.1.993 5.788-5.198-2.733-5.199 2.733.993-5.788-4.206-4.1 5.812-.845 2.6-5.266z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
