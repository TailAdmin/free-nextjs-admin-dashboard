import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserTable } from "@/components/Tables/UserTable";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
