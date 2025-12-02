"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { getOrders } from "@/actions/orders";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import GeneralCardLoading from "../ui/general/GeneralCardLoading";
import { GeneralErrorContent } from "../ui/general/GeneralErrorContent";
import Pagination from "../tables/Pagination";
import { PaginationSkeleton } from "../ui/general/PaginationSkeleton";

export default function RecentOrders() {
  const [page, setPage] = useState(1);

  const { data, error, isPending } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders({ page }),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return (
      <GeneralCardLoading title={true} className={`h-[570px] relative`}>
        <section className="flex flex-col h-full justify-between gap-4">
          <div className="animate-pulse bg-foreground/10 flex-1 min-h-[120px] w-full rounded-md" />
          <div className="flex justify-center md:justify-end w-full pt-2">
            <PaginationSkeleton />
          </div>
        </section>
      </GeneralCardLoading>
    );
  }

  if (error) {
    return <GeneralErrorContent className={`h-[570px]`} />;
  }

  return (
    <div className="overflow-hidden shadow-lg  rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 h-[570px] flex flex-col">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pedidos Recientes
          </h3>
        </div>

        {/* <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div> */}
      </div>
      <div className="max-w-full overflow-x-auto flex-1">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Productos
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Categoria
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Precio
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
              <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Fecha
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data?.orders.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
{/*                     
                        <Image
                        width={50}
                        height={50}
                          src={product.image}
                          className="h-[50px] w-[50px] object-cover"
                          alt={product.producto}
                        /> */}

                        {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder-image.png'}
                          alt={product.producto}
                          width={50}
                          height={50}
                          className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center text-gray-500"
                        />
                        ) : (
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            Img
                        </div>
                        )}

                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.producto} 
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.categoria}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ${product.precio} 
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Delivered"
                        ? "success"
                        : product.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                  {product.fecha.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {data?.orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                    No recent orders found.
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-none pt-4 pb-2 flex justify-center md:justify-end px-4">
            <Pagination
              currentPage={page}
              totalPages={data ? data.totalPages : 1}
              onPageChange={(newPage) => {  
                setPage(newPage);
              }}
            />
        </div>
    </div>
  );
}
