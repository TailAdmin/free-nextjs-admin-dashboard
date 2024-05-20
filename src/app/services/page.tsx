
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DtsList from "@/components/Services/DtsList";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DropdownDefault from "@/components/Dropdowns/DropdownDefault";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};



const Services = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Services" />

      <div className="flex flex-col gap-10">
        <DtsList />
      </div>

    </DefaultLayout>
  );
};

export default Services;
