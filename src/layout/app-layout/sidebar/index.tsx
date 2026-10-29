"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { navItems, othersItems, supportItems } from "./data";
import AppSidebarHeader from "./sidebar-header";
import SidebarNavGroup from "./sidebar-nav-group";
import SidebarWidget from "./sidebar-widget";
import { MenuType, NavItem } from "./types";

const menuSections: { type: MenuType; labelKey: string; items: NavItem[] }[] = [
  { type: "main", labelKey: "groups.menu", items: navItems },
  { type: "support", labelKey: "groups.support", items: supportItems },
  { type: "others", labelKey: "groups.others", items: othersItems },
];

const findMatchingSubmenu = (path: string) => {
  for (const section of menuSections) {
    for (let index = 0; index < section.items.length; index++) {
      const nav = section.items[index];
      if (
        nav.subItems?.some(
          (subItem) =>
            subItem.path === path ||
            (subItem.path === "/ai-settings" && path.startsWith("/ai-settings")),
        )
      ) {
        return { type: section.type, index };
      }
    }
  }
  return null;
};

export default function AppSidebar() {
  const { open, isMobile, isHovered } = useSidebar();
  const pathname = usePathname();

  const showContent = open || isHovered || isMobile;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: MenuType;
    index: number;
  } | null>(() => findMatchingSubmenu(pathname));

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenSubmenu(findMatchingSubmenu(pathname));
  }

  const handleSubmenuToggle = (index: number, menuType: MenuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const activeSections = menuSections.filter(
    (section) => section.items.length > 0,
  );

  return (
    <Sidebar side="left" collapsible="icon">
      <AppSidebarHeader showContent={showContent} />

      <SidebarContent className="overflow-y-auto px-5 duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {activeSections.map((section) => (
              <SidebarNavGroup
                key={section.type}
                labelKey={section.labelKey}
                menuType={section.type}
                items={section.items}
                openSubmenu={openSubmenu}
                showContent={showContent}
                pathname={pathname}
                onToggleSubmenu={handleSubmenuToggle}
              />
            ))}
          </div>
        </nav>
      </SidebarContent>

      {showContent && (
        <SidebarFooter className="p-0 px-5 pt-1 pb-4">
          <SidebarWidget />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
