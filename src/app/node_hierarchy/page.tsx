import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LoadGraphWithHook } from "/Users/derrickxu/EF_HACK/free-nextjs-admin-dashboard/src/components/Charts/node_grapsh"

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
        <div className="relative z-20 h-10 md:h-10"></div>
        <LoadGraphWithHook style={{ height: "400px" }} />
        <div
          id="FileUpload"
          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          />
          <div id="container" className="flex flex-col items-center justify-center space-y-3">
            
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
