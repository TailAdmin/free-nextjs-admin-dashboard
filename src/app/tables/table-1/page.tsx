import React from "react";
import TableOne from "@/components/Tables/TableOne";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Job Locations |  فرصة",
  
};

const Table1Page = () => {
  return (
    <DefaultLayout>
      <TableOne />
    </DefaultLayout>
  );
};

export default Table1Page;
