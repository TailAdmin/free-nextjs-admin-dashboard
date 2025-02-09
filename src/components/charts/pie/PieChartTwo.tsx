"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChartTwo() {
  // Mocked dark mode state (replace with actual context/state if applicable)
  const isDarkMode = true; // Change this to your dark mode logic

  // Chart configuration using useMemo for optimization
  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#9b8afb", "#fd853a", "#fdb022", "#32d583"],
      labels: ["Downloads", "Apps", "Documents", "Media"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "donut",
      },
      stroke: {
        show: false,
        width: 4,
        colors: ["transparent"], // Corrected to be an array
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: -10,
                color: isDarkMode ? "#ffffff" : "#1D2939",
                fontSize: "14px",
                fontWeight: "500",
              },
              value: {
                show: true,
                offsetY: 10,
                color: isDarkMode ? "#D1D5DB" : "#667085",
                fontSize: "12px",
                fontWeight: "400",
                formatter: () => "Used of 135 GB",
              },
              total: {
                show: true,
                label: "Total 135 GB",
                color: isDarkMode ? "#ffffff" : "#000000",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
          },
          expandOnClick: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "left",
        fontFamily: "Outfit, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        markers: {
          size: 6,
          shape: "circle",
          strokeWidth: 0,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 6,
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              width: 320,
            },
            legend: {
              itemMargin: {
                horizontal: 7,
                vertical: 5,
              },
              fontSize: "12px",
            },
          },
        },
      ],
    }),
    [isDarkMode]
  );

  // Chart data series
  const series = [45, 65, 25, 25];
  return (
    <div className="flex justify-center">
      <div id="chartSixteen">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width="400"
        />
      </div>
    </div>
  );
}
