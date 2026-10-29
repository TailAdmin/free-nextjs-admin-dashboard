import { IconProps } from ".";

export function MailIcon(props: IconProps) {
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
        d="M3.5 8.187v9.063c0 .414.336.75.75.75h15.5a.75.75 0 00.75-.75V8.187l-7.213 5.03c-.773.54-1.8.54-2.574 0L3.5 8.187zm17-1.958v.015a.236.236 0 01-.1.185l-7.97 5.558a.75.75 0 01-.859 0l-7.97-5.558A.236.236 0 013.736 6h16.528c.128 0 .232.102.236.229zm1.5.027V17.25a2.25 2.25 0 01-2.25 2.25H4.25A2.25 2.25 0 012 17.25V6.234v-.03A1.736 1.736 0 013.737 4.5h16.528c.959 0 1.736.777 1.736 1.735v.021z"
        fill="currentColor"
      />
    </svg>
  );
}
