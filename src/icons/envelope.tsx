import { IconProps } from ".";

export function EnvelopeIcon(props: IconProps) {
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
        d="M3.042 7.062v7.313a.5.5 0 00.5.5h12.916a.5.5 0 00.5-.5V7.062l-5.814 4.055a2 2 0 01-2.288 0L3.042 7.062zm13.916-1.87V5.2a.072.072 0 01-.03.055l-6.642 4.631a.5.5 0 01-.572 0L3.072 5.255a.071.071 0 01.041-.13h13.774c.038 0 .07.03.071.068zm1.5.022v9.161a2 2 0 01-2 2H3.542a2 2 0 01-2-2v-9.18-.03a1.571 1.571 0 011.571-1.54h13.774c.868 0 1.571.703 1.571 1.571v.018z"
        fill="currentColor"
      />
    </svg>
  );
}
