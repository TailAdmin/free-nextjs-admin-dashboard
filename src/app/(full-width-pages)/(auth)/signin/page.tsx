import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CityMaid Admin",
  description: "Sign in to your CityMaid Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
