import React, { forwardRef, ChangeEvent } from "react";

interface FileInput2Props {
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  disabled?: boolean;
}

const FileInput2 = forwardRef<HTMLInputElement, FileInput2Props>(
  ({ className = "", onChange, accept = "image/*", disabled = false }, ref) => {
    return (
      <input
        ref={ref}
        type="file"
        accept={accept}
        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${className}`}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
);

FileInput2.displayName = "FileInput2";

export default FileInput2;
