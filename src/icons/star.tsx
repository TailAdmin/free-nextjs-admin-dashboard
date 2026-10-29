import { IconProps } from ".";

export function StarIcon(props: IconProps) {
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
        d="M10.001 2.337l2.358 4.777 5.27.766-3.814 3.718.9 5.25-4.714-2.48-4.714 2.48.9-5.25L2.373 7.88l5.271-.766 2.357-4.777z"
        stroke="currentColor"
      />
    </svg>
  );
}
