export type OrderCategory =
  | "laptop"
  | "watch"
  | "smartphone"
  | "electronics"
  | "accessories";

export type OrderStatus = "delivered" | "pending" | "canceled";

export interface Product {
  id: number;
  name: string;
  variants: number;
  category: OrderCategory;
  price: string;
  image: string;
  status: OrderStatus;
}
