import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | TailAdmin - Next.js Dashboard Template",
  description: "Set your new password - TailAdmin Dashboard Template",
  // other metadata
};

interface ResetPasswordConfirmProps {
  params: {
    confirmKey: string;
  };
}

export default function ResetPasswordConfirm({ params }: ResetPasswordConfirmProps) {
  return <ResetPasswordForm confirmKey={params.confirmKey} />;
}