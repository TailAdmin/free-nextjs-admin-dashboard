import { IconProps } from ".";

export function TargetIcon(props: IconProps) {
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
        d="M12.752 7.223l-2.738 2.738m2.738-2.738l2.053.685 1.825-1.826-2.053-.684-.685-2.053-1.825 1.825.685 2.053zm-3.189-1.89a4.688 4.688 0 105.107 5.077m2.92-1.76a7.708 7.708 0 11-6.282-6.248"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
