"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: '100%',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif',
        },
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
      title: {
        text: 'Jobs',
        style: {
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'Outfit, sans-serif',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -5,
      fontSize: '13px',
      fontFamily: 'Outfit, sans-serif',
      markers: {
        size: 5,
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3,
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
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `${val}`,
      },
      y: {
        formatter: (val: number, { seriesIndex }) => {
          return seriesIndex === 0 ? `${val} Jobs Posted` : `${val} Jobs Completed`;
        },
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
      marker: {
        show: true,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
          plotOptions: {
            bar: {
              columnWidth: '55%',
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
          },
          plotOptions: {
            bar: {
              columnWidth: '60%',
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Jobs Posted",
      data: [45, 52, 38, 65, 55, 48, 60, 42, 58, 70, 65, 50],
    },
    {
      name: "Jobs Completed",
      data: [35, 42, 30, 55, 45, 40, 52, 35, 48, 60, 55, 42],
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Job Activity
        </h3>

        <div className="relative inline-block">
          <button 
            onClick={toggleDropdown} 
            className="dropdown-toggle"
            aria-label="More options"
            title="More options"
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="relative w-full h-[250px] sm:h-[280px] md:h-[220px] lg:h-[240px] xl:h-[220px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
