import { IconProps } from ".";

export function GearIcon(props: IconProps) {
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
        d="M6.775 5.52a1.484 1.484 0 00-2.028.542L3.231 8.688c-.41.71-.166 1.617.543 2.027.99.571.99 1.999 0 2.57a1.484 1.484 0 00-.543 2.027l1.516 2.626c.41.71 1.318.953 2.028.543A1.484 1.484 0 019 19.766c0 .82.664 1.484 1.484 1.484h3.032c.82 0 1.484-.664 1.484-1.484a1.484 1.484 0 012.225-1.285c.71.41 1.617.167 2.027-.543l1.516-2.626c.41-.71.167-1.617-.543-2.027a1.484 1.484 0 010-2.57c.71-.41.953-1.317.543-2.027l-1.516-2.626a1.484 1.484 0 00-2.027-.543 1.483 1.483 0 01-2.225-1.285c0-.82-.664-1.484-1.484-1.484h-3.032c-.82 0-1.484.664-1.484 1.484a1.484 1.484 0 01-2.226 1.285z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.085 12a3.085 3.085 0 11-6.17 0 3.085 3.085 0 016.17 0z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
