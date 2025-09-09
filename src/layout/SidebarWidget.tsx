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
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Quick Stats
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
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
      
      <div className="mt-6 space-y-2">
        <button className="w-full px-3 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors">
          Add New Maid Profile
        </button>
        <button className="w-full px-3 py-2 text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
          Post New Job
        </button>
      </div>
    </div>
  );
}
