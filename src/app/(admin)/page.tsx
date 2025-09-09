import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 md:gap-6">
      {/* Main Content Area */}
      <div className="col-span-12 space-y-6 lg:col-span-8 xl:col-span-7">
        {/* Stats Cards - Only one instance of EcommerceMetrics */}
        <EcommerceMetrics />

        {/* Charts */}
        <div className="space-y-6">
          <MonthlySalesChart />
          <StatisticsChart />
        </div>

        {/* Recent Orders - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block">
          <RecentOrders />
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <div className="col-span-12 space-y-6 lg:col-span-4 xl:col-span-5">
        <MonthlyTarget />
        <DemographicCard />
      </div>

      {/* Recent Orders - Only shown on mobile */}
      <div className="col-span-12 lg:hidden">
        <RecentOrders />
      </div>
    </div>
  );
}
