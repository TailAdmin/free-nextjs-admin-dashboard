import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import DefaultAlert from "@/components/others/ui-elements/alerts/default-alert";
import ErrorAlert from "@/components/others/ui-elements/alerts/error-alert";
import InfoAlert from "@/components/others/ui-elements/alerts/info-alert";
import SuccessAlert from "@/components/others/ui-elements/alerts/success-alert";
import WarningAlert from "@/components/others/ui-elements/alerts/warning-alert";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Alerts | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Alerts page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Alerts" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Alert">
          <DefaultAlert />
        </ComponentCard>
        <ComponentCard title="Success Alert">
          <SuccessAlert />
        </ComponentCard>
        <ComponentCard title="Warning Alert">
          <WarningAlert />
        </ComponentCard>
        <ComponentCard title="Error Alert">
          <ErrorAlert />
        </ComponentCard>
        <ComponentCard title="Info Alert">
          <InfoAlert />
        </ComponentCard>
      </div>
    </div>
  );
}
