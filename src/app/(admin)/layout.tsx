"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import { useSidebar } from "@/context/SidebarContext";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/lib/services/authService";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, token } = useInitializeAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const authState = useAuthStore((state) => state.isAuthenticated);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token && !authState && refreshToken) {
        try {
          await refreshAccessToken();
          setCheckingAuth(false);
        } catch (error) {
          console.warn("Gagal perbarui token", error);
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (checkingAuth) {
    return <LoadingSpinner isFullScreen/>;
  }

  if (!token || !isAuthenticated) {
    router.push("/signin");
    return null;
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