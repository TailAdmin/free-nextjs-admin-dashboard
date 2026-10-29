import PageBreadcrumb from "@/components/common/page-breadcrumb";
import AddressSection from "@/components/main/profile/address";
import DangerZone from "@/components/main/profile/danger";
import PersonalInformationSection from "@/components/main/profile/personal-information";
import SecuritySection from "@/components/main/profile/security/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "Manage your personal information, security settings, and preference on the TailAdmin Profile page.",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          Profile
        </h3>
        <div className="space-y-6">
          <PersonalInformationSection />
          <AddressSection />
          <SecuritySection />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
