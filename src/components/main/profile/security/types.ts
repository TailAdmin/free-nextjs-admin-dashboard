import type { ReactNode } from "react";

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface SecurityItemProps {
  title: string;
  description: string;
  action: ReactNode;
  hasDivider?: boolean;
  className?: string;
}

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: (data: ChangePasswordFormData) => void;
}

export interface SecurityProps {
  initialSettings?: SecuritySettings;
  className?: string;
  onPasswordChange?: (data: ChangePasswordFormData) => void;
  onTwoFactorChange?: (enabled: boolean) => void;
}
