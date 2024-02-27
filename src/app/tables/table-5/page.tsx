'use client'
import React from "react";
import TableThree from "@/components/Tables/TableThree";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from "next/head";


const Table1Page = () => {
  return (
    <><Head>
    <title>Job Offers | فرصة </title>
    {/* Any other head elements like meta tags */}
  </Head>
    <DefaultLayout>
      <TableThree />
    </DefaultLayout>
    </>
  );
};

export default Table1Page;
