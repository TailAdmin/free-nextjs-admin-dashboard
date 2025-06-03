import ProfileClientWrapper from "./ProfileWrap";

export const metadata = {
  title: "Profil Pengguna",
  description: "Lihat dan kelola informasi profil Anda.",
};

export default function ProfilePage() {
  return (
    <>
      <ProfileClientWrapper />
    </>
  );
}