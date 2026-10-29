import { IconProps } from ".";

export function FileIcon(props: IconProps) {
  return (
    <svg
      className="fill-current"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.834 19.75a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25V9.621c0-.596.236-1.169.658-1.59L10.86 2.66A2.25 2.25 0 0112.45 2h5.133a2.25 2.25 0 012.25 2.25v15.5zm-2.25.75a.75.75 0 00.75-.75V4.25a.75.75 0 00-.75-.75h-5.002l.002 4a2.25 2.25 0 01-2.25 2.25h-4v10c0 .414.335.75.75.75h10.5zM7.393 8.25l3.69-3.691.001 2.941a.75.75 0 01-.75.75H7.393zm1.19 6.25a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}
