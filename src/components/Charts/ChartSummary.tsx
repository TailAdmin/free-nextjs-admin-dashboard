import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
  labels: ["Desktop", "Tablet", "Mobile", "Unknown"],
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartSummary: React.FC<any> = ({}) => {
  function randomIntFromInterval(min : any, max: any) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  var item = localStorage.getItem("parsedCSVData")
  var parsedCSVData = item ? JSON.parse(item)  : {}
  var carbon_emissions_intensity = 0;
  var total_rev = randomIntFromInterval(10000, 50000);
  var ACEPDR = 0;
  if (parsedCSVData){
    carbon_emissions_intensity = 0;
    total_rev = randomIntFromInterval(10000, 50000);
    ACEPDR = 0;
    // eslint-disable-next-line
    if (parsedCSVData){
      // eslint-disable-next-line
      var  parsedCSVData_1 = parsedCSVData
      parsedCSVData_1.forEach((row: any, index: any) => {
        console.log(
          "row.carbon_emission",
          row["volume_ordered_quarterly"],
          row["price_per_item"],
        );
        carbon_emissions_intensity += +row["carbon_emissions"];
      });
      ACEPDR = carbon_emissions_intensity / total_rev;
    }

  }

  const series = [65, 34, 12, 56];
  // const columns = ["summary", "summary1"];
  // call function to get actual data
  const rows_: any = [
    {
      id: 1,
      Meausre: "Absolute Carbon Emission",
      Value: carbon_emissions_intensity ? carbon_emissions_intensity : randomIntFromInterval(5000,20000),
    },
    {
      id: 2,
      Meausre: "ACEPDR Absolute Carbon Emission Per Dollar Revenue",
      Value: ACEPDR ? ACEPDR : randomIntFromInterval(5000,1000),
    },
  ];
  const columns: any = [
    { field: "Meausre", minWidth: 380 },
    { field: "Value" },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div>
        <h5 className="text-xl font-semibold text-black dark:text-white">
          Carbon Emission Summary Statistics
        </h5>
      </div>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows_}
          columns={columns}
          // initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          isRowSelectable={() => false}
          sx={{ border: 0 }}
        />
      </Paper>
      <span></span>
    </div>
  );
};

export default ChartSummary;
