import { IconProps } from ".";

export function DocIcon(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 19.75A2.25 2.25 0 0117.25 22H6.75a2.25 2.25 0 01-2.25-2.25V9.621c0-.596.237-1.169.659-1.59l5.367-5.371A2.25 2.25 0 0112.118 2h5.132a2.25 2.25 0 012.25 2.25v15.5zm-2.25.75a.75.75 0 00.75-.75V4.25a.75.75 0 00-.75-.75h-5.002l.003 4A2.25 2.25 0 0110 9.75H6v10c0 .414.336.75.75.75h10.5zM7.06 8.25l3.689-3.691.002 2.941a.75.75 0 01-.75.75H7.059zm1.19 6.25a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}
