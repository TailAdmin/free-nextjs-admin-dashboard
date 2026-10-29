import type { ReactNode } from "react";
import type { SignUpFormData } from "./schema";

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: ReactNode;
}

export type { SignUpFormData };

export interface SignUpFormFieldsProps {
  className?: string;
  onSubmit?: (data: SignUpFormData) => void | Promise<void>;
}

