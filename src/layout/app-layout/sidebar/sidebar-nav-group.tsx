"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { HorizontalDotsIcon } from "@/icons";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import SidebarMenuItem from "./sidebar-menu-item";
import { MenuType, NavItem } from "./types";

interface SidebarNavGroupProps {
  labelKey: string;
  menuType: MenuType;
  items: NavItem[];
  openSubmenu: { type: MenuType; index: number } | null;
  showContent: boolean;
  pathname: string;
  onToggleSubmenu: (index: number, menuType: MenuType) => void;
}

export default function SidebarNavGroup({
  labelKey,
  menuType,
  items,
  openSubmenu,
  showContent,
  pathname,
  onToggleSubmenu,
}: SidebarNavGroupProps) {
  const t = useTranslations("sidebar");

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        className={cn(
          "mb-4 flex h-auto p-0 text-xs leading-5 text-gray-400 uppercase",
          !showContent ? "xl:justify-center" : "justify-start",
        )}
      >
        {showContent ? t(labelKey) : <HorizontalDotsIcon />}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((nav, index) => (
          <SidebarMenuItem
            key={nav.key}
            nav={nav}
            isOpen={
              openSubmenu?.type === menuType && openSubmenu?.index === index
            }
            showContent={showContent}
            pathname={pathname}
            onToggle={() => onToggleSubmenu(index, menuType)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
