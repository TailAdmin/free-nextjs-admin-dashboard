import { IconProps } from ".";

export function TicketIcon(props: IconProps) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.95833 6.125C3.99184 6.125 3.20833 6.9085 3.20833 7.875V11.2998C4.69996 11.2998 5.9098 12.509 5.9098 14.0006C5.9098 15.4923 4.7006 16.7015 3.20897 16.7015L3.20833 20.125C3.20833 21.0915 3.99184 21.875 4.95833 21.875H23.0417C24.0082 21.875 24.7917 21.0915 24.7917 20.125V16.7015C23.3003 16.7011 22.0915 15.4921 22.0915 14.0006C22.0915 12.5092 23.3003 11.3001 24.7917 11.2998V7.875C24.7917 6.9085 24.0082 6.125 23.0417 6.125H4.95833Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
