import React from "react";
import TableThree from "@/components/Tables/TableThree";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Job Offers' List |  فرصة",
  
};

const Table1Page = () => {
  return (
    <DefaultLayout>
      <TableThree />
    </DefaultLayout>
  );
};

export default Table1Page;
