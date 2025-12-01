import ProductTable from "@/components/products/ProductTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Next.js Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {

  return <ProductTable />

}
