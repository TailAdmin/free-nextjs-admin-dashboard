import { getProducts } from "@/actions/product";
import ProductsView from "@/components/products/ProductsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Next.js Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsView products={products} />;
}
