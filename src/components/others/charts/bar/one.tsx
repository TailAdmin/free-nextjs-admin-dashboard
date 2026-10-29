"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/theme-context";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function BarChartOne() {
  const { theme } = useTheme();

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "38%",
        borderRadius: 8,
        borderRadiusApplication: "around",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${(val / 100).toFixed(1)}%`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 400,
        colors: [theme === "dark" ? "#94A3B8" : "#364153"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme === "dark" ? "#94A3B8" : "#364153",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      max: 420,
      min: 0,
      tickAmount: 4,
      labels: {
        show: false,
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#1E2640" : "#F3F4F6",
      strokeDashArray: 0,
      padding: {
        left: -10,
        right: 0,
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#7592FF",
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
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${(val / 100).toFixed(1)}%`,
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [230, 310, 270, 390, 210, 170, 260, 270, 150, 80, 180, 120],
    },
  ];

  return (
    <ScrollArea className="max-w-full">
      <div className="min-w-162.5 xl:min-w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={200}
        />
      </div>
    </ScrollArea>
  );
}

