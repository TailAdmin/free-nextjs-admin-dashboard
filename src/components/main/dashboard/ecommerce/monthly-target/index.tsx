"use client";

import { useTheme } from "@/context/theme-context";
import { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import CardHeader from "./card-header";
import MonthlyStats from "./monthly-stats";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const { theme } = useTheme();
  const t = useTranslations("ecommerce.monthlyTarget");

  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "80%",
        },
        track: {
          background: theme === "dark" ? "#1E2640" : "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -35,
            color: theme === "dark" ? "#FFFFFF" : "#1D2939",
            formatter: function (val: number) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#465FFF"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#9CB9FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#465FFF",
            opacity: 1,
          },
        ],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3">
      <div className="shadow-default flex flex-1 flex-col justify-between rounded-2xl bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-11 dark:bg-gray-900">
        <CardHeader />

        <div>
          <div className="relative">
            <div className="max-h-45 overflow-hidden" id="chartDarkStyle">
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>

            <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
              +10%
            </span>
          </div>
          <p className="mx-auto mt-4.5 w-full max-w-95 text-center text-sm text-gray-500 sm:text-base dark:text-gray-400">
            {t("earned", { amount: "$3287" })}
          </p>
        </div>
      </div>

      <MonthlyStats />
    </div>
  );
}
