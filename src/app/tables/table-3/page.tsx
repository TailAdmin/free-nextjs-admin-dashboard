import React from "react";
import TableSix from "@/components/Tables/TableSix";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Job Providers |  فرصة",
  
};

const Table1Page = () => {
  return (
    <DefaultLayout>
      <TableSix/>
    </DefaultLayout>
  );
};

export default Table1Page;
