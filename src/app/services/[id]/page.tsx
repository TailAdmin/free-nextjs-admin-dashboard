import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DtsList from "@/components/Services/DtsList";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DropdownDefault from "@/components/Dropdowns/DropdownDefault";
import { useRouter } from 'next/router';
import DtsViewEdit from "@/components/Services/DtsViewEdit";


export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};



const Service = () => {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Service" />

      <div className="flex flex-col gap-10">
        <DtsViewEdit />
      </div>

    </DefaultLayout>
  );
};

export default Service;
