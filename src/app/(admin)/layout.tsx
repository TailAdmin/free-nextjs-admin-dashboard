"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();


  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token); 

  useEffect(() => {
    if (!token || !isAuthenticated) {
      if (typeof window !== "undefined") { 
        router.push("/signin");
      }
    }
  }, [token, isAuthenticated, router]);

  if (typeof window !== "undefined" && (!token || !isAuthenticated)) {
    return <LoadingSpinner isFullScreen />; 
  }

  // Layout utama
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6">{children}</div>
      </div>
    </div>
  );
}