"use client";

import type React from "react";
import { useState } from "react";

const CopyInput: React.FC = () => {
  const [website, setWebsite] = useState("www.tailadmin.com");
  const [copyText, setCopyText] = useState("Copy");

  const copyWebsite = () => {
    navigator.clipboard.writeText(website).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={copyWebsite}
        className="absolute end-0 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 border-s border-gray-200 py-3 ps-3.5 pe-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-400"
      >
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.58822 4.58398C6.58822 4.30784 6.81207 4.08398 7.08822 4.08398H15.4154C15.6915 4.08398 15.9154 4.30784 15.9154 4.58398L15.9154 12.9128C15.9154 13.189 15.6916 13.4128 15.4154 13.4128H7.08821C6.81207 13.4128 6.58822 13.189 6.58822 12.9128V4.58398ZM7.08822 2.58398C5.98365 2.58398 5.08822 3.47942 5.08822 4.58398V5.09416H4.58496C3.48039 5.09416 2.58496 5.98959 2.58496 7.09416V15.4161C2.58496 16.5207 3.48039 17.4161 4.58496 17.4161H12.9069C14.0115 17.4161 14.9069 16.5207 14.9069 15.4161L14.9069 14.9128H15.4154C16.52 14.9128 17.4154 14.0174 17.4154 12.9128L17.4154 4.58398C17.4154 3.47941 16.52 2.58398 15.4154 2.58398H7.08822ZM13.4069 14.9128H7.08821C5.98364 14.9128 5.08822 14.0174 5.08822 12.9128V6.59416H4.58496C4.30882 6.59416 4.08496 6.81801 4.08496 7.09416V15.4161C4.08496 15.6922 4.30882 15.9161 4.58496 15.9161H12.9069C13.183 15.9161 13.4069 15.6922 13.4069 15.4161L13.4069 14.9128Z"
            fill=""
          />
        </svg>
        <div>{copyText}</div>
      </button>
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        type="url"
        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 ps-4 pe-[90px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        placeholder="Enter website URL"
      />
    </div>
  );
};

export default CopyInput;
