import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartSevenState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartSeven: React.FC = () => {
  const [state, setState] = useState<ChartSevenState>({
    series: [
      {
        name: 'Received Amount',
        data: [0, 20, 35, 45, 35, 55, 65, 50, 65, 75, 60, 75],
      },
      {
        name: 'Due Amount',
        data: [15, 9, 17, 32, 25, 68, 80, 68, 84, 94, 74, 62],
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
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#C7D2E2'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 310,
      type: 'area',
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
      curve: 'smooth',
      // width: ['3.5', '3.5'],
    },

    markers: {
      size: 0,
    },
    // labels: {
    //   show: false,
    //   position: 'top',
    // },
    grid: {
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
    tooltip: {
      fixed: {
        enabled: !1,
      },
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function (e) {
            return '';
            e
          },
        },
      },
      marker: {
        show: !1,
      },
    },
    xaxis: {
      type: 'category',
      categories: [
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
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
          fontSize: '0px',
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-title-sm2 font-bold text-black dark:text-white">
            Payments Overview
          </h4>
        </div>
        <div className="flex items-center">
          <p className="font-medium uppercase text-black dark:text-white">
            Short by:
          </p>
          <div className="relative z-20 inline-block">
            <select
              name="#"
              id="#"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 font-medium outline-none"
            >
              <option value="">Monthly</option>
              <option value="">Weekly</option>
            </select>
            <span className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.99995 12.8249C8.8312 12.8249 8.69058 12.7687 8.54995 12.6562L2.0812 6.2999C1.82808 6.04678 1.82808 5.65303 2.0812 5.3999C2.33433 5.14678 2.72808 5.14678 2.9812 5.3999L8.99995 11.278L15.0187 5.34365C15.2718 5.09053 15.6656 5.09053 15.9187 5.34365C16.1718 5.59678 16.1718 5.99053 15.9187 6.24365L9.44995 12.5999C9.30933 12.7405 9.1687 12.8249 8.99995 12.8249Z"
                  fill="#64748B"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div>
        <div id="chartSeven" className="-ml-5">
          <ApexCharts
            options={options}
            series={state.series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col text-center xsm:flex-row">
        <div className="border-stroke py-2 dark:border-strokedark xsm:w-1/2 xsm:border-r">
          <p className="font-medium">Received Amount</p>
          <h4 className="mt-1 text-title-sm font-bold text-black dark:text-white">
            $45,070.00
          </h4>
        </div>
        <div className="py-2 xsm:w-1/2">
          <p className="font-medium">Due Amount</p>
          <h4 className="mt-1 text-title-sm font-bold text-black dark:text-white">
            $32,400.00
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartSeven;
