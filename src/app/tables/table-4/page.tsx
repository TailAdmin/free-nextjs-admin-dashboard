import React from "react";
import TableFive from "@/components/Tables/TableFive";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Total Users |  فرصة",
  
};

const Table1Page = () => {
  return (
    <DefaultLayout>
      <TableFive />
    </DefaultLayout>
  );
};

export default Table1Page;
