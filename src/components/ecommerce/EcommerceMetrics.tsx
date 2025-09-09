"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { 
  ArrowUpIcon, 
  UserIcon, 
  TaskIcon, 
  LockIcon,
  DollarLineIcon 
} from "@/icons";

const metrics = [
  {
    id: 1,
    title: "Total Maids",
    value: "1,234",
    change: "+8.2%",
    changeType: 'increase',
    icon: <UserIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    id: 2,
    title: "Active Jobs",
    value: "89",
    change: "+12.5%",
    changeType: 'increase',
    icon: <TaskIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />,
    iconBg: "bg-green-100 dark:bg-green-900/30"
  },
  {
    id: 3,
    title: "Today's Unlocks",
    value: "42",
    change: "+5.1%",
    changeType: 'increase',
    icon: <LockIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    id: 4,
    title: "Revenue Today",
    value: "$2,450",
    change: "+3.7%",
    changeType: 'increase',
    icon: <DollarLineIcon />,
    iconBg: "bg-amber-100 dark:bg-amber-900/30"
  }
];

export const EcommerceMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
              <div 
                className={`${metric.iconBg} flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 sm:h-12 sm:w-12`}
              >
                {React.cloneElement(metric.icon, {
                  className: "w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-white/90"
                })}
              </div>
            </div>
            <Badge
              color={metric.changeType === 'increase' ? 'success' : 'error'}
              variant="light"
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              {metric.change}
              <ArrowUpIcon className="h-3 w-3" />
            </Badge>
          </div>
          <div className="mt-3 sm:mt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
              {metric.title}
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              {metric.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
