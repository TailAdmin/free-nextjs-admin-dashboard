import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import BarChartOne from "@/components/others/charts/bar/one";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Bar Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Bar Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function BarChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
