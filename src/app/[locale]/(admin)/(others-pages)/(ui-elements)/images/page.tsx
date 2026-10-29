import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ResponsiveImage from "@/components/others/ui-elements/images/responsive";
import ThreeColumnImageGrid from "@/components/others/ui-elements/images/three-column-greed";
import TwoColumnImageGrid from "@/components/others/ui-elements/images/two-column-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Images | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Images page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Images() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  );
}
