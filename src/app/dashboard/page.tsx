import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { getProducts } from "@/actions/product";
import { getOrders } from "@/actions/orders";
import ProductTable from "@/components/products/ProductTable";
import { ProductsMetrics } from "@/components/ecommerce/ProductsMetrics";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Ecommerce() {
    const orders = await getOrders();
  
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
       <div className="col-span-12">
        <ProductsMetrics />
      </div>
      <div className="col-span-12">
        <ProductTable />
      </div>
      
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12">
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}
