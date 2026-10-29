import type { ReactNode } from "react";

export type DangerActionVariant = "outline" | "danger-outline";

export interface DangerActionItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon?: ReactNode;
  variant?: DangerActionVariant;
  onClick?: () => void;
}

export interface DangerItemProps {
  title: string;
  description: string;
  buttonText: string;
  icon?: ReactNode;
  variant?: DangerActionVariant;
  hasDivider?: boolean;
  className?: string;
  onAction?: () => void;
}

export interface DangerZoneProps {
  title?: string;
  items?: DangerActionItem[];
  className?: string;
  onLogout?: () => void;
  onDelete?: () => void;
}
