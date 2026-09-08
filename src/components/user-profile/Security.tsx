"use client";

import { useState } from "react";

export default function Security() {
  const [switcherToggle, setSwitcherToggle] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
        Security
      </h4>
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end dark:border-gray-800">
          <div>
            <span className="mb-1 block text-base font-medium text-gray-800 dark:text-white/90">
              Change Password
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive real-time notifications and team alerts.
            </p>
          </div>
          <div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 pe-4 ps-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.3861 5.08087L14.9182 7.61296M15.6437 3.5917L16.408 4.35603C16.8962 4.84419 16.8962 5.63564 16.408 6.1238L7.83547 14.6963C7.69039 14.8414 7.51182 14.9486 7.31554 15.0083L3.97461 16.0251L4.99141 12.6842C5.05115 12.4879 5.15829 12.3093 5.30337 12.1642L13.8759 3.5917C14.3641 3.10355 15.1555 3.10355 15.6437 3.5917Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Change Password
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end dark:border-gray-800">
          <div>
            <span className="block text-base font-medium text-gray-800 dark:text-white/90">
              Two-factor authentication (2FA)
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep your account secure by enabling 2FA
            </p>
          </div>
          <div>
            <label
              htmlFor="toggle1"
              className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700 select-none dark:text-gray-400"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle1"
                  className="sr-only"
                  checked={switcherToggle}
                  onChange={(e) => setSwitcherToggle(e.target.checked)}
                />
                <div
                  className={`block h-5 w-9 rounded-full duration-200 ${
                    switcherToggle
                      ? "bg-brand-500 dark:bg-brand-500"
                      : "bg-gray-200 dark:bg-white/10"
                  }`}
                ></div>
                <div
                  className={`absolute top-0.5 start-0.5 h-4 w-4 rounded-full bg-white shadow-theme-sm duration-200 ease-linear ${
                    switcherToggle
                      ? "translate-x-full rtl:-translate-x-full"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
