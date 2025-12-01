"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { getProducts, getUniqueBrands } from "@/actions/product";
import AddProductDialog from "./AddProductDialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import GeneralCardLoading from "../ui/general/GeneralCardLoading";
import { GeneralErrorContent } from "../ui/general/GeneralErrorContent";
import Pagination from "../tables/Pagination";
import { useState } from "react";
import { PaginationSkeleton } from "../ui/general/PaginationSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectValue } from "../ui/select";
import ExpandableInput from "../ui/expandable-input";
import { useDebounce } from "@/hooks/useDebounce";
import { useSidebar } from "@/context/SidebarContext";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },

];

type StatusValue = typeof statusOptions[number]["value"];

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<StatusValue>(statusOptions[0].value);
  const { isMobile } = useSidebar();
  const debouncedSearch = useDebounce(search, 500);

  const { data: brands } = useQuery({
    queryKey: ["product-brands"],
    queryFn: getUniqueBrands,
  });

  const { data, error, isPending, isFetching  } = useQuery({
    queryKey: ["products", page, debouncedSearch, brand, status],
    queryFn: () => getProducts({ page, search: debouncedSearch, brand, status }),
    placeholderData: keepPreviousData,
  });

  if(isPending){
    return <GeneralCardLoading title={true} className={`h-[570px] relative`} >
      <section className="flex flex-col h-full justify-between gap-4">
        <div className="animate-pulse bg-foreground/10 h-[100cqh] min-h-[120px] !aspect-autow-full rounded-md"/>        
        <div className="absolute left-1/2 bottom-8 md:bottom-0 transform md:relative -translate-x-1/2 md:self-end md:flex md:justify-end md:w-full">
          <PaginationSkeleton />
        </div>
      </section>
      </GeneralCardLoading>
  }

  if(error){
    return <GeneralErrorContent className={`h-[570px]`} />
  }

  return (
    <div className={`overflow-hidden flex flex-col relative rounded-2xl h-[570px] border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6`} >
      <div className="flex flex-col gap-3">
        <div className="flex items-center w-full justify-between">      
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Productos
          </h3>
          
        <div className="flex flex-row  justify-end gap-3 items-center w-full">            
            <ExpandableInput
              expandedSize={isMobile ? "150px" : "300px"}
              placeholder="Buscar..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          {!isMobile ? ( 
              <>
            
          <div className="w-full sm:w-1/4">
            <Select
              value={brand}
              onValueChange={(value) => {
                setBrand(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full dark:bg-dark-900">
                <SelectValue placeholder="Filtrar por marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands &&
                    brands.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>


            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as StatusValue);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40 dark:bg-dark-900">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
                      </>

          ): (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <FilterIcon className="size-4 text-zinc-500"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="flex flex-col gap-3 p-2">
              <Input
              className="text-sm w-full h-9"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <Select
                value={brand}
                onValueChange={(value) => {
                  setBrand(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full dark:bg-dark-900">
                  <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands &&
                      brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

                <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as StatusValue);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full dark:bg-dark-900">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            </PopoverContent>
            </Popover>
          )}
          <AddProductDialog />

        </div>
        
        </div>
     
      </div>
      <div className="max-w-full flex-1  flex flex-col justify-between overflow-x-auto ">
        
        <Table className="h-full">
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                
                className="py-3 min-w-44 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nombre
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Marca
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Precio
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Inventario
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-center text-gray-500  text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
              <TableCell
                
                className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
              >
                Pedidos
              </TableCell>
            </TableRow>
          </TableHeader>
            
          <TableBody isLoading={isFetching} className="divide-y divide-gray-100 dark:divide-gray-800 relative">
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
                <TableCell className="py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {product.marca}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  ${product.precio.toFixed(2)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {product.inventario}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-center flex items-center justify-center text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={product.estado ? "success" : "error"}
                  >
                    {product.estado ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-end text-gray-500 text-theme-sm dark:text-gray-400">
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
        <div className="absolute left-1/2 bottom-8 md:bottom-4 transform -translate-x-1/2 md:self-end md:flex md:justify-end md:w-full md:pr-6">
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
