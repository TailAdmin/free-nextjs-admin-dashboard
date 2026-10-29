import { IconProps } from ".";

export function UploadIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M15 11.25a.75.75 0 01.75.75v1.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V12a.75.75 0 011.5 0v1.5c0 .414.335.75.75.75h9a.75.75 0 00.75-.75V12a.75.75 0 01.75-.75zm-5.998-9a.744.744 0 01.547.241L13 5.937A.75.75 0 0111.938 7L9.752 4.813V12a.75.75 0 01-1.5 0V4.809l-2.19 2.19A.75.75 0 015 5.938l3.468-3.466a.745.745 0 01.532-.222z"
        fill="currentColor"
      />
    </svg>
  );
}
