'use client'
import React from "react";
import TableOne from "@/components/Tables/TableOne";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from "next/head";


const Table1Page = () => {
  return (
    <>
    <Head>
    <title>Job Locations | فرصة </title>
    {/* Any other head elements like meta tags */}
    </Head>
  
    <DefaultLayout>
      <TableOne />
    </DefaultLayout>
    </>
  );
};

export default Table1Page;
