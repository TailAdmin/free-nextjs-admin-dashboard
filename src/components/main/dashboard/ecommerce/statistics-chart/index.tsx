"use client";

import { useTheme } from "@/context/theme-context";
import { ApexOptions, ApexTooltipCustomOpts } from "apexcharts";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import CardHeader from "./card-header";
import { getStatisticsSeries, monthKeys, type StatisticTab } from "./data";

interface TooltipSeriesItem {
  name?: string;
}

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const { theme } = useTheme();
  const t = useTranslations("ecommerce.statistics");
  const tMonths = useTranslations("ecommerce.months");

  const [selectedTab, setSelectedTab] = useState<StatisticTab>("overview");
  const [dateRangeFactor, setDateRangeFactor] = useState<number>(1);

  const handleDateRangeChange = useCallback(([start, end]: [Date, Date]) => {
    const days = Math.round(
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const factor = Math.max(0.6, Math.min(1.4, Number((days / 30).toFixed(2))));
    setDateRangeFactor(factor);
  }, []);

  const series = useMemo(
    () => getStatisticsSeries(selectedTab, t, dateRangeFactor),
    [selectedTab, t, dateRangeFactor],
  );

  const colors = useMemo(() => {
    switch (selectedTab) {
      case "sales":
        return ["#465FFF"];
      case "revenue":
        return ["#9CB9FF"];
      case "overview":
      default:
        return ["#465FFF", "#9CB9FF"];
    }
  }, [selectedTab]);

  const options: ApexOptions = useMemo(
    () => ({
      legend: {
        show: false,
      },
      colors,
      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        width: selectedTab === "overview" ? [2, 2] : [2],
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
        },
      },
      markers: {
        size: 0,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      grid: {
        borderColor: theme === "dark" ? "#1E2640" : "#F3F4F6",
        strokeDashArray: 0,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        custom: function ({
          series: chartSeries,
          dataPointIndex,
          w,
        }: ApexTooltipCustomOpts) {
          const category =
            w.globals?.categoryLabels?.[dataPointIndex] ??
            w.config.xaxis?.categories?.[dataPointIndex] ??
            "";
          const colors = w.config.colors ?? ["#465FFF"];
          const seriesList =
            (w.config.series as unknown as TooltipSeriesItem[]) ?? [];

          const rows = seriesList
            .map((s, idx) => {
              const val = chartSeries[idx]?.[dataPointIndex];
              const color = colors[idx] ?? "#465FFF";
              const formattedVal =
                typeof val === "number" ? val.toLocaleString() : (val ?? "");
              return `
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="size-1.5 rounded-full shrink-0" style="background-color: ${color}"></span>
                    <span class="w-13 text-xs text-gray-800 dark:text-white/90">${s.name ?? ""}</span>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">:</span>
                  </div>
                  <span class="text-xs font-medium text-gray-800 dark:text-white/90">${formattedVal}</span>
                </div>
              `;
            })
            .join("");

          return `
            <div class="min-w-32.5">
              <p class="mb-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">${category}</p>
              <div class="flex flex-col gap-1">
                ${rows}
              </div>
            </div>
          `;
        },
      },
      xaxis: {
        type: "category",
        categories: monthKeys.map((key) => tMonths(key)),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
          width: 2,
          position: "back",
          opacity: 1,
          stroke: {
            width: 0,
            color: "none",
          },
          fill: {
            type: "gradient",
            gradient: {
              colorFrom:
                theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
              colorTo: "#9CB9FF",
              stops: [0, 100],
              opacityFrom: 1,
              opacityTo: 1,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Outfit, sans-serif",
            colors: theme === "dark" ? "#94A3B8" : "#6B7280",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Outfit, sans-serif",
            colors: theme === "dark" ? "#94A3B8" : "#6B7280",
          },
        },
        title: {
          text: "",
          style: {
            fontSize: "0px",
          },
        },
      },
    }),
    [colors, selectedTab, tMonths, theme],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-250 xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
