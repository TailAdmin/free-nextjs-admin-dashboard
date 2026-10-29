import type { ReactNode } from "react";
import type { SignInFormData } from "./schema";

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: ReactNode;
}

export type { SignInFormData };

export interface SignInFormFieldsProps {
  className?: string;
  onSubmit?: (data: SignInFormData) => void | Promise<void>;
}

