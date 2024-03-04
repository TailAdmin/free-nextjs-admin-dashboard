'use client'
import React from "react";
import TableOne from "@/components/Tables/TableOne";
import TableEight from "@/components/Tables/TableEight";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Head from "next/head";


const Table1Page = () => {
  return (
    <>
    
  
    <DefaultLayout>
      <TableOne />
      <TableEight />
    </DefaultLayout>
    </>
  );
};

export default Table1Page;
