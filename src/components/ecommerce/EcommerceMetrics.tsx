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
    icon: <DollarLineIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />,
    iconBg: "bg-amber-100 dark:bg-amber-900/30"
  }
];

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div 
          key={metric.id} 
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-sm transition-shadow duration-200"
        >
          <div className={`flex items-center justify-center w-12 h-12 ${metric.iconBg} rounded-xl`}>
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            <Badge color={metric.changeType === 'increase' ? 'success' : 'error'}>
              {metric.changeType === 'increase' ? <ArrowUpIcon /> : <ArrowUpIcon className="transform rotate-180" />}
              {metric.change}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
