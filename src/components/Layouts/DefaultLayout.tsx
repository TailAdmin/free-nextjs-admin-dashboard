"use client";

import React from "react";
import { useLockedBody } from "@/hooks/useBodyLock";
import { NavbarWrapper } from "../Navbar/navbar";
import { SidebarWrapper } from "../Sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { FilterProvider } from "../Navbar/filter-context";
import {AlertBanner} from "@/components/Banner/alert-banner"

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
        
                        
      <section className='flex flex-col'>
      <AlertBanner />
      <div className="flex">
        <SidebarWrapper />


        


        <FilterProvider> 
          <NavbarWrapper>{children}</NavbarWrapper>
        </FilterProvider>
        </div>
      </section>
      
    </SidebarContext.Provider>
  );
};