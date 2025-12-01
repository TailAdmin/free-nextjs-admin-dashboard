"use client";

import { createProduct } from "@/actions/product";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { PlusIcon } from "lucide-react";


export default function AddProductDialog({className}: {className?: string}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
 function handleSubmit(formData: FormData) {
      mutation.mutate(formData);
  }

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      
    },
    onError: () => {
      toast.error("Error al crear el producto");
    }
  });

  return (
     <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
            <DialogTrigger asChild>
              <Button className={className} size="icon" onClick={() => setIsModalOpen(true)}><PlusIcon className="size-5"/></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="sr-only">
                <DialogTitle >Agregar producto</DialogTitle>
                <DialogDescription>Este es una descripción para el diálogo.</DialogDescription>
              </DialogHeader>
              <form action={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Agregar producto</h2>
  
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input type="text" name="nombre" id="nombre" placeholder="Nombre del producto" />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Input type="text" name="descripcion" id="descripcion" placeholder="Descripción" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Precio</Label>
          <Input type="number" name="precio" id="precio" placeholder="0.00" step={0.01} />
        </div>
        <div>
          <Label htmlFor="inventario">Inventario</Label>
          <Input type="number" name="inventario" id="inventario" placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marca">Marca</Label>
          <Input type="text" name="marca" id="marca" placeholder="Marca" />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input type="text" name="color" id="color" placeholder="Color" />
        </div>
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input type="text" name="sku" id="sku" placeholder="SKU" />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" size="sm" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button size="sm" loading={mutation.isPending} disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  Cerrar
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog> 
  );
    
}
