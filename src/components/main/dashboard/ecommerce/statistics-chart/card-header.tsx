"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CalendarIcon } from "@/icons";
import { cn } from "@/utils";
import flatpickr from "flatpickr";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { StatisticTab } from "./data";

interface CardHeaderProps {
  selectedTab: StatisticTab;
  onTabChange: (tab: StatisticTab) => void;
  onDateRangeChange: (dates: [Date, Date]) => void;
}

const tabs: StatisticTab[] = ["overview", "sales", "revenue"];

export default function CardHeader({
  selectedTab,
  onTabChange,
  onDateRangeChange,
}: CardHeaderProps) {
  const t = useTranslations("ecommerce.statistics");
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d M",
      defaultDate: [startDate, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          onDateRangeChange([selectedDates[0], selectedDates[1]]);
        }
      },
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, [onDateRangeChange]);

  return (
    <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("title")}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <ButtonGroup className="gap-0.5 rounded-lg bg-gray-100 p-0.5 *:data-slot:rounded-md! dark:bg-gray-900">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab)}
              className={cn(
                "h-8 px-3 text-sm font-medium transition-colors",
                selectedTab === tab
                  ? "bg-white text-gray-900 shadow-theme-xs hover:bg-white hover:text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
                  : "text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white",
              )}
            >
              {t(tab)}
            </Button>
          ))}
        </ButtonGroup>

        <div className="relative inline-flex items-center">
          <CalendarIcon className="pointer-events-none absolute inset-s-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            ref={datePickerRef}
            className="h-9 w-40 cursor-pointer rounded-lg border border-gray-200 bg-white ps-9 pe-3 text-sm font-medium text-gray-700 shadow-theme-xs outline-none hover:bg-gray-50 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
            placeholder={t("selectDateRange")}
          />
        </div>
      </div>
    </div>
  );
}
