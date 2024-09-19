import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LoginComponent } from "@/components/loginForm";

export const metadata: Metadata = {
  title: "Admin Dashboard || DS",
  description: "Admin Dashboard",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
        <LoginComponent />
    </main>
  );
}
