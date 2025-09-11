"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  UserCircleIcon,
  ListIcon,
  LockIcon,
  DollarLineIcon,
  TaskIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon className="w-5 h-5" />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon className="w-5 h-5" />,
    name: "My Profile",
    path: "/profile",
  },
  {
    icon: <ListIcon className="w-5 h-5" />,
    name: "Job Opportunities",
    path: "/jobs/available",
  },
  {
    icon: <LockIcon className="w-5 h-5" />,
    name: "Unlock History",
    path: "/unlocks",
  },
  {
    icon: <DollarLineIcon className="w-5 h-5" />,
    name: "Payment History",
    path: "/payments",
  },
  {
    icon: <TaskIcon className="w-5 h-5" />,
    name: "Settings",
    path: "/settings",
  },
];

// Keep the othersItems array for potential future use
const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isMobileOpen, closeSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        closeSidebar();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar]);

  const isActive = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  const renderMenuItems = () => (
    <ul className="flex flex-col space-y-1">
      {navItems.map((nav) => (
        <li key={nav.name}>
          <Link
            href={nav.path || "#"}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive(nav.path || "")
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
            }`}
            onClick={() => isMobile && closeSidebar()}
          >
            <span className="flex items-center justify-center w-6 h-6 mr-3">
              {nav.icon}
            </span>
            <span>{nav.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-transform duration-300 ${
          isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="CityMaid"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Maid Dashboard
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {renderMenuItems()}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
