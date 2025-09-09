import React from "react";
import { 
  UserIcon, 
  TaskIcon, 
  LockIcon, 
  ArrowUpIcon,
  UserCircleIcon
} from "../icons";

export default function SidebarWidget() {
  const stats = [
    {
      id: 1,
      name: "Total Maids",
      value: "1,234",
      icon: <UserCircleIcon className="w-4 h-4 text-brand-500" />,
      change: "+12.5%",
      changeType: 'increase'
    },
    {
      id: 2,
      name: "Active Jobs",
      value: "89",
      icon: <TaskIcon className="w-4 h-4 text-green-500" />,
      change: "+5.2%",
      changeType: 'increase'
    },
    {
      id: 3,
      name: "Today's Unlocks",
      value: "42",
      icon: <LockIcon className="w-4 h-4 text-purple-500" />,
      change: "+3.1%",
      changeType: 'increase'
    },
    {
      id: 4,
      name: "Revenue Today",
      value: "$2,450",
      icon: <ArrowUpIcon className="w-4 h-4 text-blue-500" />,
      change: "+8.7%",
      changeType: 'increase'
    }
  ];

  return (
    <div className="mx-auto w-full rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03] lg:max-w-60 lg:px-4 lg:py-5">
      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Quick Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-1 lg:gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-start justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:bg-transparent">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-white p-1.5 shadow-sm dark:bg-gray-800 lg:bg-white/50 dark:lg:bg-gray-800/50">
                {stat.icon}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center text-xs font-medium ${
              stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <button 
          className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Maid</span>
            <span className="hidden sm:inline lg:hidden">Profile</span>
          </span>
        </button>
        <button 
          className="w-full rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 dark:focus:ring-offset-gray-900"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Post Job</span>
          </span>
        </button>
      </div>
    </div>
  );
}
