"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAppSession } from "@/entities/session/use-app-session";
import useUserData from "@/hooks/useUserData";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  variant: "auth" | "private" | "public";
}
const menuGroups = [
  {
    name: "MENU",
    menuItems: [

      {icon: (
        <svg
          className="fill-current"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_130_9756)">
            <path
              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
              fill=""
            />
          </g>
          <defs>
            <clipPath id="clip0_130_9756">
              <rect
                width="18"
                height="18"
                fill="white"
                transform="translate(0 0.052124)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
      label: "Customers",
      route: "/customers",
    },
    {icon: (
      <svg
        className="fill-current"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_130_9756)">
          <path
            d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
            fill=""
          />
        </g>
        <defs>
          <clipPath id="clip0_130_9756">
            <rect
              width="18"
              height="18"
              fill="white"
              transform="translate(0 0.052124)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    label: "Transactions",
    route: "/transactions",
  },

    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, variant }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { userData, error, isLoading } = useUserData();
  return (
    <>
      {userData && (
        <ClickOutside onClick={() => setSidebarOpen(false)}>
          <aside
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Image
                    width={64}
                    height={64}
                    src={"/images/logo/aghanim_logo-2.png"}
                    alt="Logo"
                    priority
                  />
                </Link>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#AEB7C0",
                  }}
                >
                  AghanimAdmin
                </p>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="sidebar"
                className="block lg:hidden"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
              {/* <!-- Sidebar Menu --> */}
              <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
                {menuGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                      {group.name}
                    </h3>

                    <ul className="mb-6 flex flex-col gap-1.5">
                      {group.menuItems.map((menuItem, menuIndex) => (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          pageName={pageName}
                          setPageName={setPageName}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
              {/* <!-- Sidebar Menu --> */}
            </div>
          </aside>
        </ClickOutside>
      )}
    </>
  );
};

export default Sidebar;
