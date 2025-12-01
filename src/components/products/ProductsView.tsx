"use client";

import { useState } from "react";
import ProductTable from "./ProductTable";
import AddProductForm from "./AddProductForm";
import Button from "../ui/button/Button";
import { Product } from "@/actions/product";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function ProductsView({ products }: { products: Product[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Management</h2>
        <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>Agregar Produto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle >Dialog Title</DialogTitle>
              <DialogDescription>This is a description for the dialog.</DialogDescription>
            </DialogHeader>
            <AddProductForm onClose={() => setIsModalOpen(false)} />
            <DialogFooter>
              <DialogClose asChild>
                Cerrar
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>      
      </div>

      <ProductTable products={products} />
    </div>
  );
}
