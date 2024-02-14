'use client'
import React from "react";
import TableFive from "@/components/Tables/TableFive";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from 'next/head';


const Table1Page = () => {
  return (
    <>
      <Head>
        <title>Total Users | فرصة</title>
        {/* Any other head elements like meta tags */}
      </Head>
      <DefaultLayout>
        <TableFive />
      </DefaultLayout>
    </>
  );
};

export default Table1Page; 
