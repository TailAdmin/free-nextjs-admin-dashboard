"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { getProducts } from "@/actions/product";
import AddProductDialog from "./AddProductDialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import GeneralCardLoading from "../ui/general/GeneralCardLoading";
import { GeneralErrorContent } from "../ui/general/GeneralErrorContent";
import Pagination from "../tables/Pagination";
import { useState } from "react";

export default function ProductTable() {
  const [page, setPage] = useState(1);

  const { data, error, isPending } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts({page: page}),
    placeholderData: keepPreviousData,
  });

  if(isPending){
    return <GeneralCardLoading />;
  }

  if(error){
    return <GeneralErrorContent />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center w-full justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Productos
          </h3>
          <AddProductDialog />
         
        </div>
      </div>
      <div className="max-w-full overflow-x-auto min-h-fit">
        
        <Table className="min-h-40">
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nombre
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Marca
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Precio
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Inventario
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pedidos
              </TableCell>
            </TableRow>
          </TableHeader>
            
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
            {data?.products && data.products.length > 0 && data.products.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {/* Placeholder image since we don't have images yet */}
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                       Img
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.nombre}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.sku}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.marca}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ${product.precio.toFixed(2)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.inventario}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={product.estado ? "success" : "error"}
                  >
                    {product.estado ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.pedidoProductosCount || 0}
                </TableCell>
              </TableRow>
            ))} 
            {
              data?.products && data.products.length === 0 && (  
                <TableRow>
                  <TableCell className=" absolute top-1/2 bottom-1/2 inset-0 col-span-6 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                    Sin productos disponibles
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={data ? data.totalPages : 10}
              onPageChange={(newPage) => {  
                setPage(newPage);
              }}
            />
   
          </div>
            
      </div>
    </div>
  );
}
