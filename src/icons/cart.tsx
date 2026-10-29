import { IconProps } from ".";

export function CartIcon(props: IconProps) {
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
        d="M2.316 4h1.181a1.5 1.5 0 011.485 1.291l.152 1.08m0 0l1.102 7.838A1.5 1.5 0 007.722 15.5h9.361a1.5 1.5 0 001.376-.901l2.667-6.129a1.5 1.5 0 00-1.375-2.098H5.134z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.783 19.5h.01m8.527 0h.01"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
