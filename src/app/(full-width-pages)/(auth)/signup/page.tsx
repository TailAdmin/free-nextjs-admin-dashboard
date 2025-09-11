import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | CityMaid Admin",
  description: "Create a new CityMaid Admin account",
};

export default function SignUp() {
  return <SignUpForm />;
}
