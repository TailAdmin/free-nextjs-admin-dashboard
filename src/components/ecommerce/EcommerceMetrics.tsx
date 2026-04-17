"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, DollarLineIcon, BoltIcon } from "@/icons";

interface MetricCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string;
  trend: "up" | "down";
  trendValue: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  trend,
  trendValue,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBgColor}`}>
        <div className={iconColor}>{icon}</div>
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
        <Badge color={trend === "up" ? "success" : "error"}>
          {trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon className={trend === "down" ? "text-error-500" : ""} />}
          {trendValue}
        </Badge>
      </div>
    </div>
  );
};

export const EcommerceMetrics = () => {
  const metrics: MetricCardProps[] = [
    {
      icon: <GroupIcon className="size-6" />,
      iconBgColor: "bg-brand-50 dark:bg-brand-500/15",
      iconColor: "text-brand-500",
      title: "Total Customers",
      value: "3,782",
      trend: "up",
      trendValue: "11.01%",
    },
    {
      icon: <BoxIconLine className="size-6" />,
      iconBgColor: "bg-orange-50 dark:bg-orange-500/15",
      iconColor: "text-orange-500",
      title: "Total Orders",
      value: "5,359",
      trend: "down",
      trendValue: "9.05%",
    },
    {
      icon: <DollarLineIcon className="size-6" />,
      iconBgColor: "bg-success-50 dark:bg-success-500/15",
      iconColor: "text-success-500",
      title: "Total Revenue",
      value: "$48,295",
      trend: "up",
      trendValue: "15.3%",
    },
    {
      icon: <BoltIcon className="size-6" />,
      iconBgColor: "bg-blue-light-50 dark:bg-blue-light-500/15",
      iconColor: "text-blue-light-500",
      title: "Net Profit",
      value: "$12,847",
      trend: "up",
      trendValue: "8.7%",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};
