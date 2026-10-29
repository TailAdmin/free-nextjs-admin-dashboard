import type { SVGProps } from "react";

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12.6732 3.41872C12.4373 3.10275 12.066 2.91667 11.6717 2.91667H8.32825C7.93391 2.91667 7.56268 3.10275 7.32672 3.41872L6.83189 4.08131C6.59593 4.39727 6.2247 4.58336 5.83036 4.58336H3.54167C2.85131 4.58336 2.29167 5.14301 2.29167 5.83336V14.375C2.29167 15.0654 2.85131 15.625 3.54167 15.625H16.4583C17.1487 15.625 17.7083 15.0654 17.7083 14.375V5.83336C17.7083 5.14301 17.1487 4.58336 16.4583 4.58336H14.1696C13.7752 4.58336 13.404 4.39727 13.1681 4.08131L12.6732 3.41872Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 9.79329C13.3333 11.6342 11.8409 13.1266 10 13.1266C8.15905 13.1266 6.66667 11.6342 6.66667 9.79329C6.66667 7.95234 8.15905 6.45996 10 6.45996C11.8409 6.45996 13.3333 7.95234 13.3333 9.79329Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
