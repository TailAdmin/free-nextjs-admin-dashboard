import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LoadGraphWithHook } from "@/components/Charts/node_grapsh"

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};
const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Node Hierarchy" />
        {/* hooking up sending to svc */}
        <LoadGraphWithHook style={{ height: "400px" }} />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
