import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartSixState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartSix: React.FC = () => {
  const [state, setState] = useState<ChartSixState>({
    series: [
      {
        name: "Product One",
        data: [168, 285, 131, 248, 187, 295, 191, 269, 201, 185, 252, 151],
      },

      {
        name: "Product Two",
        data: [268, 185, 251, 198, 287, 205, 281, 199, 259, 185, 150, 111],
      },
    ],
  });

  // Update the state
  const updateState = () => {
    setState((prevState) => ({
      ...prevState,
      // Update the desired properties
    }));
  };
  updateState;

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#13C296", "#3C50E0"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 200,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        // enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
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
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },

    markers: {
      size: 0,
    },
    // labels: {
    //   show: false,
    //   position: 'top',
    // },
    grid: {
      strokeDashArray: 7,
      xaxis: {
        lines: {
          show: true,
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
    xaxis: {
      type: "category",
      categories: [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h4 className="text-title-sm2 font-bold text-black dark:text-white">
            Campaign Visitors
          </h4>
          <div className="mt-2.5 flex gap-2.5">
            <h3 className="mb-1.5 text-title-lg font-bold text-black dark:text-white">
              $560.93
            </h3>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_554_43030)">
                  <path
                    d="M13.4731 5.62415H9.95118C9.68868 5.62415 9.46993 5.8429 9.46993 6.1054C9.46993 6.3679 9.68868 6.58665 9.95118 6.58665H12.1168L9.3168 8.4679C9.20743 8.5554 9.0543 8.5554 8.92305 8.4679L6.03555 6.56477C5.57618 6.25852 5.00743 6.25852 4.54805 6.56477L1.1793 8.8179C0.960552 8.97102 0.894927 9.27727 1.04805 9.49602C1.13555 9.62727 1.28868 9.71477 1.46368 9.71477C1.55118 9.71477 1.66055 9.6929 1.72618 9.62727L5.1168 7.37415C5.22618 7.28665 5.3793 7.28665 5.51055 7.37415L8.39805 9.29915C8.85743 9.6054 9.42618 9.6054 9.88555 9.29915L12.9699 7.22102V9.64915C12.9699 9.91165 13.1887 10.1304 13.4512 10.1304C13.7137 10.1304 13.9324 9.91165 13.9324 9.64915V6.1054C13.9762 5.8429 13.7356 5.62415 13.4731 5.62415Z"
                    fill="#10B981"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_554_43030">
                    <rect
                      width="14"
                      height="14"
                      fill="white"
                      transform="translate(0.45752 0.877319)"
                    />
                  </clipPath>
                </defs>
              </svg>
              +2.5%
            </span>
          </div>
          <span className="mt-1 block font-medium">
            Average cost per interaction
          </span>
        </div>
        <DropdownDefault />
      </div>
      <div>
        <div id="chartSix" className="-ml-5">
          <ApexCharts
            options={options}
            series={state.series}
            type="area"
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSix;
