import type { Metadata } from "next";
import React from "react";
import FileUpload from "./(others-pages)/(dokumen)/fileupload/page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main Dashboard",
};

export default function Main() {

  return (
    <>
        <FileUpload />
    </>
  );
}