import Input from "../input/InputField";

export default function UrlPrefixInput() {
  return (
    <div className="relative">
      <span className="absolute start-0 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center border-e border-gray-200 py-3 ps-3.5 pe-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        http://
      </span>

      <Input type="url" placeholder="www.tailadmin.com" className="ps-[90px]" />
    </div>
  );
}
