import DocumentGrid from "@/components/documents/DocumentGrid";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import FileUploadPage from "./(others-pages)/(dokumen)/fileupload/page";

export const metadata: Metadata = {
  title: "Dokumen",
  description: "Tempat Dokumen",
};

export default function Main() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-500 text-start dark:text-gray-400">Tanda Tangan</h1>
        <h3 className="text-xl font-medium text-gray-500 text-start dark:text-gray-400">Pilih Dokumen</h3>
      </div>
      <FileUploadPage/>
      <DocumentGrid />
      <br />
      <BasicTableOne/>
    </>
  );
}