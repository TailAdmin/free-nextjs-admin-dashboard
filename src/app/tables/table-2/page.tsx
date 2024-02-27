'use client'
import React from "react";
import TableSeven from "@/components/Tables/TableSeven";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from "next/head";


const Table1Page = () => {
  return (
    <>
    <Head>
    <title>job seekers | فرصة</title>
    {/* Any other head elements like meta tags */}
  </Head>
    <DefaultLayout>
      <TableSeven />
    </DefaultLayout>
    </>
  );
};

export default Table1Page;
