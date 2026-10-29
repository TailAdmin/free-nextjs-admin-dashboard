import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import TableFive from "@/components/main/tables/basic-tables/table-five";
import TableFour from "@/components/main/tables/basic-tables/table-four";
import TableOne from "@/components/main/tables/basic-tables/table-one";
import TableThree from "@/components/main/tables/basic-tables/table-three";
import TableTwo from "@/components/main/tables/basic-tables/table-two";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Basic Data Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Data Table page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <TableOne />
        </ComponentCard>
        <ComponentCard title="Basic Table 2">
          <TableTwo />
        </ComponentCard>
        <ComponentCard title="Basic Table 3">
          <TableThree />
        </ComponentCard>
        <ComponentCard title="Basic Table 4">
          <TableFour />
        </ComponentCard>
        <ComponentCard title="Basic Table 5">
          <TableFive />
        </ComponentCard>
      </div>
    </div>
  );
}
