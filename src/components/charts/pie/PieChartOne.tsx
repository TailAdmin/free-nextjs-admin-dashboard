"use client";
import React from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChartOne() {
  const options: ApexOptions = {
    colors: ["#3641f5", "#7592ff", "#dde9ff"],
    labels: ["Desktop", "Mobile", "Tablet"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      width: 445,
      height: 290,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            value: {
              show: true,
              offsetY: 0,
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 4, // Creates a gap between the series
    },

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 4,
        shape: "circle",

        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 370,
            height: 290,
          },
        },
      },
    ],
  };
  const series = [45, 65, 25];
  return (
    <div className="flex justify-center">
      <div id="chartSeven">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={290}
        />
      </div>
    </div>
  );
}
