import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | TailAdmin - Next.js Dashboard Template",
  description: "Reset your password - TailAdmin Dashboard Template",
  // other metadata
};

export default function ForgotPassword() {
  return <ResetPasswordForm />;
}