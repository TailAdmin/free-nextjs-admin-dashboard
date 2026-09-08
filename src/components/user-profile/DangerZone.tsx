export default function DangerZone() {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
        Danger Zone
      </h4>
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end dark:border-gray-800">
          <div>
            <span className="mb-1 block text-base font-medium text-gray-800 dark:text-white/90">
              Logout all devices
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign out from every active session.
            </p>
          </div>
          <div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 pe-4 ps-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              <svg
                className="rtl:-scale-x-100"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M3.33325 10.0003L9.79159 10.0003M6.66599 6.66699L3.33488 10.0002L6.66599 13.3337M8.12492 4.16374V3.54199C8.12492 2.85164 8.68456 2.29199 9.37492 2.29199H14.3749C15.0653 2.29199 15.6249 2.85164 15.6249 3.54199V16.4587C15.6249 17.149 15.0653 17.7087 14.3749 17.7087H9.37492C8.68456 17.7087 8.12492 17.149 8.12492 16.4587V15.8337"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end dark:border-gray-800">
          <div>
            <span className="mb-1 block text-base font-medium text-gray-800 dark:text-white/90">
              Delete account
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
          <div>
            <button className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-error-500 py-2.5 pe-4 ps-3.5 text-sm font-medium text-error-500 transition-all hover:bg-error-100 dark:border-error-500/15 dark:hover:bg-red-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4.37492 4.79199V16.4587C4.37492 17.149 4.93456 17.7087 5.62492 17.7087H14.3749C15.0653 17.7087 15.6249 17.149 15.6249 16.4587V4.79199M3.33325 4.79199H16.6658M4.37492 13.2466V8.24658M15.6249 13.2466V8.24658M8.33325 13.7503V8.75033M11.6666 13.7503V8.75033M12.7078 4.79199V3.54199C12.7078 2.85164 12.1482 2.29199 11.4578 2.29199H8.54118C7.85082 2.29199 7.29118 2.85164 7.29118 3.54199V4.79199H12.7078Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
