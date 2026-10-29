import { IconProps } from ".";

export function BoxTappedIcon(props: IconProps) {
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
        d="M14 24.59v-.004m0-11.718v11.718m-4.935-8.22v-5.758m9.87-4.933l-9.868 4.933M23.591 8.28c.178.277.277.603.277.944v9.554a1.75 1.75 0 01-.967 1.565l-8.118 4.058a1.748 1.748 0 01-.783.185M23.591 8.28l-8.808 4.404a1.75 1.75 0 01-1.565 0L4.41 8.28m19.181 0a1.748 1.748 0 00-.69-.621L14.783 3.6a1.75 1.75 0 00-1.565 0L5.101 7.66c-.287.144-.524.36-.69.62m0 0a1.749 1.749 0 00-.277.945v9.554c0 .663.374 1.269.967 1.565l8.117 4.058c.246.124.514.185.782.185"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
