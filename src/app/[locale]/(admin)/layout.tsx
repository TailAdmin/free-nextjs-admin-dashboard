"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        <div className="p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
