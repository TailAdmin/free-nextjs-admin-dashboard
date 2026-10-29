import { IconProps } from ".";

export function SendIcon(props: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.985 2.444c-1.872-.873-3.832 1.026-3.02 2.924l1.856 4.337a.75.75 0 010 .59l-1.856 4.337c-.812 1.899 1.148 3.797 3.02 2.925l11.833-5.517c1.733-.808 1.733-3.271 0-4.079L4.985 2.444zm-1.64 2.334c-.271-.633.382-1.265 1.006-.975l11.834 5.518a.75.75 0 010 1.359L4.35 16.197c-.624.29-1.277-.342-1.006-.975L5.2 10.885a2.28 2.28 0 00.054-.138h3.864a.75.75 0 000-1.5H5.252a2.253 2.253 0 00-.052-.132L3.345 4.778z"
        fill="currentColor"
      />
    </svg>
  );
}
