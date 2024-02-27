'use client'
import React from "react";
import TableSix from "@/components/Tables/TableSix";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from 'next/head';


const Table1Page = () => {
  return (
    <>
    
      <Head>
        <title>job providers | فرصة</title>
        {/* Any other head elements like meta tags */}
      </Head>
      
      <DefaultLayout>
        
        <TableSix />
      </DefaultLayout>
    </>
  );
};

export default Table1Page; 
