import { IconProps } from ".";

export function UsersIcon(props: IconProps) {
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
        d="M14.109 5.104a2.947 2.947 0 11.001 5.39m1.687 2.727c3.802.224 5.024 2.788 5.416 4.47.186.797-.47 1.458-1.289 1.458H17.59m-5.839-11.35a2.947 2.947 0 11-5.894 0 2.947 2.947 0 015.894 0zM8.75 13.205c4.234 0 5.554 2.726 5.964 4.486.186.797-.47 1.458-1.29 1.458H4.076c-.818 0-1.475-.662-1.29-1.458.411-1.76 1.73-4.486 5.964-4.486z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
