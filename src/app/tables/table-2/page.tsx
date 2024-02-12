import React from "react";
import TableSeven from "@/components/Tables/TableSeven";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Job Seekers |  فرصة",
  
};

const Table1Page = () => {
  return (
    <DefaultLayout>
      <TableSeven />
    </DefaultLayout>
  );
};

export default Table1Page;
