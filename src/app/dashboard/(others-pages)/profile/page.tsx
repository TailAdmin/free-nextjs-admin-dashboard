import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import { getProfile } from "@/actions/profile";

export const metadata: Metadata = {
  title: "Perfil | TailAdmin - Next.js Dashboard Template",
  description:
    "Esta es la página de perfil.",
};

export default async function Profile() {
  const data = await getProfile();

  if (!data) {
      return <div>Cargando...</div> // Or redirect to login
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={data.user} profile={data.profile} />
          <UserAddressCard profile={data.profile} />
        </div>
      </div>
    </div>
  );
}
