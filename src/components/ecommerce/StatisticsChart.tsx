"use client";
import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import { getSalesData } from "@/actions/product";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,

});

export default function StatisticsChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("yearly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    { name: "Ventas", data: [] },
    { name: "Ingresos", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  const years = [
    { value: (new Date().getFullYear() - 1).toString(), label: (new Date().getFullYear() - 1).toString() },
    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
    { value: (new Date().getFullYear() + 1).toString(), label: (new Date().getFullYear() + 1).toString() },
  ];

  const months = [
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const { sales, revenue, categories } = await getSalesData(period, year, month);
        setSeries([
          { name: "Ventas", data: sales },
          { name: "Ingresos", data: revenue },
        ]);
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    }
    fetchData();
  }, [period, year, month]);

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: period === "monthly" && categories.length > 0 && categories[0].includes("-") ? "datetime" : "category", // Category-based x-axis
      categories: categories,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
      labels: {
        format: "dd MMM",
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };


  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estadísticas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Resumen de ventas e ingresos
          </p>
        </div>
        <div className="flex items-center w-full gap-3 sm:justify-end flex-wrap">
          {period !== "weekly" && (
            <div className="w-full sm:w-32">
              <Select
                defaultValue={year.toString()}
                onValueChange={(val) => setYear(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          {period === "monthly" && (
            <div className="w-full sm:w-40">
              <Select
                defaultValue={month.toString()}
                onValueChange={(val) => setMonth(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          <ChartTab selected={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-full">
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
