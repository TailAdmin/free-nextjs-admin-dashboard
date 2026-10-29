import { IconProps } from ".";

export function MapIcon(props: IconProps) {
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
        d="M8.876 19.456c.119 0 .237-.014.353-.041l5.542-1.33a1.492 1.492 0 01.707.001l3.915.959a1.5 1.5 0 001.857-1.457V7.177a1.5 1.5 0 00-1.144-1.457l-1.876-.46m-3.1 12.783v-4.885m-6.254 6.298a1.5 1.5 0 01-.354-.043L3.893 18.28a1.5 1.5 0 01-1.143-1.457V6.41a1.5 1.5 0 011.857-1.457l1.161.285m3.108 14.217v-6.311m6.406-7.114c0 3.313-3.273 5.967-3.273 5.967S8.72 9.344 8.72 6.031a3.281 3.281 0 116.563 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.031h.01"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
