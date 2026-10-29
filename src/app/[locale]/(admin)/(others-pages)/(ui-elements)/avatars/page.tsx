import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import AvatarGroupPreview from "@/components/others/ui-elements/avatars/avatar-group";
import BusyIndicator from "@/components/others/ui-elements/avatars/busy-indicator";
import DefaultAvatar from "@/components/others/ui-elements/avatars/default-avatar";
import OfflineIndicator from "@/components/others/ui-elements/avatars/offline-indicator";
import OnlineIndicator from "@/components/others/ui-elements/avatars/online-indicator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Avatars | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Avatars page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AvatarPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Avatar" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Avatar">
          <DefaultAvatar />
        </ComponentCard>

        <ComponentCard title="Avatar Group">
          <AvatarGroupPreview />
        </ComponentCard>

        <ComponentCard title="Avatar with Online Indicator">
          <OnlineIndicator />
        </ComponentCard>

        <ComponentCard title="Avatar with Offline Indicator">
          <OfflineIndicator />
        </ComponentCard>

        <ComponentCard title="Avatar with Busy Indicator">
          <BusyIndicator />
        </ComponentCard>
      </div>
    </div>
  );
}
