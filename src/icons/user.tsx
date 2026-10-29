import { IconProps } from ".";

export function UserIcon(props: IconProps) {
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
        d="M16.25 16.199s.105-5.417-6.25-5.417S3.75 16.2 3.75 16.2m9.302-10.912a2.995 2.995 0 11-5.991 0 2.995 2.995 0 015.99 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
