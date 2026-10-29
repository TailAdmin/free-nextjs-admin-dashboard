import { Product } from "./types";

export const recentOrdersData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: 2,
    category: "laptop",
    price: "$2399.00",
    status: "delivered",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: 1,
    category: "watch",
    price: "$879.00",
    status: "pending",
    image: "/images/product/product-02.jpg",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: 2,
    category: "smartphone",
    price: "$1869.00",
    status: "delivered",
    image: "/images/product/product-03.jpg",
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: 2,
    category: "electronics",
    price: "$1699.00",
    status: "canceled",
    image: "/images/product/product-04.jpg",
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: 1,
    category: "accessories",
    price: "$240.00",
    status: "delivered",
    image: "/images/product/product-05.jpg",
  },
];
