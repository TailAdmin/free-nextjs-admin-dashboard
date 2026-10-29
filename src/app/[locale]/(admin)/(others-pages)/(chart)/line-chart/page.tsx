import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import LineChartOne from "@/components/others/charts/line/one";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Line Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Line Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function LineChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
