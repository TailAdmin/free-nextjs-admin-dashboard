"use client";

import { createProduct } from "@/actions/product";
import Label from "../form/Label";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import ImageUpload from "./ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ColorPicker } from "../ui/color-picker";

type Category = { id: number; name: string };

export default function AddProductDialog({className}: {className?: string}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [color, setColor] = useState("#000000");
  const queryClient = useQueryClient();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    if (isModalOpen) {
        fetchCategories();
    }
  }, [isModalOpen]);

 function handleSubmit(formData: FormData) {
      // Add selectedCategory to formData
      if (selectedCategory !== null) {
        formData.append("id_category", selectedCategory.toString());
      } else {
        formData.append("id_category", ""); 
      }
      
      // Add images to formData
      images.forEach((file) => {
        formData.append("images", file);
      });

      formData.set("color", color);

      mutation.mutate(formData);
  }

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setSelectedCategory(null);
      setImages([]);
      setColor("#000000");
    },
    onError: () => {
      toast.error("Error al crear el producto");
    }
  });

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button className={className} size="icon" onClick={() => setIsModalOpen(true)}><PlusIcon className="size-4"/></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar producto</DialogTitle>
            <DialogDescription>
              Agrega un nuevo producto a tu inventario.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            handleSubmit={handleSubmit} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            images={images} 
            setImages={setImages} 
            color={color}
            setColor={setColor}
            mutation={mutation} 
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DrawerTrigger asChild>
        <Button className={className} size="icon" onClick={() => setIsModalOpen(true)}><PlusIcon className="size-4"/></Button>
      </DrawerTrigger>
      <DrawerContent className="!max-h-[90dvh] !h-[90dvh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Agregar producto</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo producto a tu inventario.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <ProductForm 
            handleSubmit={handleSubmit} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            images={images} 
            setImages={setImages} 
            color={color}
            setColor={setColor}
            mutation={mutation} 
            onCancel={() => setIsModalOpen(false)}
            className="pb-4"
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProductForm({
  handleSubmit,
  categories,
  selectedCategory,
  setSelectedCategory,
  images,
  setImages,
  color,
  setColor,
  mutation,
  onCancel,
  className
}: {
  handleSubmit: (formData: FormData) => void;
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
  color: string;
  setColor: (color: string) => void;
  mutation: any;
  onCancel: () => void;
  className?: string;
}) {
  return (
    <form action={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input type="text" name="nombre" id="nombre" placeholder="Nombre del producto" />
      </div>

      <div>
        <Label htmlFor="id_category">Categoria</Label>
        <Combobox
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Seleccionar categoria"
        />
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
          <div className="flex gap-2">
             <div 
                className="size-9 rounded-md border shrink-0" 
                style={{ backgroundColor: color }}
             />
             <ColorPicker 
                value={color as `#${string}`}
                type="hex"
                disableFormatToggle={true}
                onValueChange={(val) => setColor(val.hex)}
             >
                <Button variant="outline" className="w-full justify-start h-9 text-left font-normal">
                    {color}
                </Button>
             </ColorPicker>
             <input type="hidden" name="color" value={color} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input type="text" name="sku" id="sku" placeholder="SKU" />
      </div>

      <div>
        <Label>Imágenes</Label>
        <ImageUpload value={images} onChange={setImages} />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" size="sm" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button size="sm" loading={mutation.isPending} disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
}
