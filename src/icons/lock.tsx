import { IconProps } from ".";

export function LockIcon(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.625 13.958a.625.625 0 00-1.25 0v1.25a.625.625 0 001.25 0v-1.25z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.667a4.375 4.375 0 00-4.375 4.375v1.562H4.583c-1.035 0-1.875.84-1.875 1.875v6.979c0 1.035.84 1.875 1.875 1.875h10.834c1.035 0 1.875-.84 1.875-1.875V9.479c0-1.036-.84-1.875-1.875-1.875h-1.042V6.041A4.375 4.375 0 0010 1.667zm3.125 4.375v1.562h-6.25V6.041a3.125 3.125 0 016.25 0zM4.584 8.854a.625.625 0 00-.625.625v6.979c0 .345.28.625.624.625h10.834c.345 0 .625-.28.625-.625V9.479a.625.625 0 00-.625-.625H4.583z"
        fill="currentColor"
      />
    </svg>
  );
}
