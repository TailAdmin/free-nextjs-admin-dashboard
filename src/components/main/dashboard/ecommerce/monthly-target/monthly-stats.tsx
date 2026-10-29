"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { useTranslations } from "next-intl";

interface StatProps {
  label: string;
  value: string;
  trend: "up" | "down";
}

function Stat({ label, value, trend }: StatProps) {
  return (
    <div>
      <p className="mb-1 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
        {label}
      </p>
      <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
        {value}
        {trend === "up" ? (
          <ArrowUpIcon className="text-green-500" />
        ) : (
          <ArrowDownIcon className="text-red-500" />
        )}
      </p>
    </div>
  );
}

export default function MonthlyStats() {
  const t = useTranslations("ecommerce.monthlyTarget");

  return (
    <div className="flex items-center justify-center gap-5 px-6 py-3 sm:gap-8 sm:py-5">
      <Stat label={t("target")} value="$20K" trend="down" />
      <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
      <Stat label={t("revenue")} value="$70K" trend="up" />
      <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
      <Stat label={t("today")} value="$30K" trend="up" />
    </div>
  );
}
