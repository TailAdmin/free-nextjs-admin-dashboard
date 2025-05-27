import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pertanahan",
  description: "Login Pertanahan",
};

export default function SignIn() {
  return <SignInForm />;
}
