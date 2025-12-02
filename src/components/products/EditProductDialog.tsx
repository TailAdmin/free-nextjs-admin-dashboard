"use client";

import { updateProduct, Product } from "@/actions/product";
import Label from "../form/Label";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useState, useEffect } from "react";
import { PencilIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import ImageUpload from "./ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ColorPicker } from "../ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Category = { id: number; name: string };

export default function EditProductDialog({ product, className }: { product: Product; className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(product.id_category);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(product.images);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [color, setColor] = useState(product.color || "#000000");
  const [status, setStatus] = useState<string>(product.real_status || "activo");
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
        setExistingImages(product.images.sort((a, b) => a.orden - b.orden));
        setDeletedImageIds([]);
        setImages([]);
        setStatus(product.real_status || "activo");
    }
  }, [isModalOpen, product]);

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

      // Add deleted images
      deletedImageIds.forEach(id => formData.append("deletedImageIds", id.toString()));

      // Add image order
      const imageOrder = existingImages.map((img, index) => ({ id: img.id, orden: index }));
      formData.append("imageOrder", JSON.stringify(imageOrder));

      formData.set("color", color);
      formData.set("real_status", status);

      mutation.mutate(formData);
  }

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProduct(product.id, formData),
    onSuccess: () => {
      toast.success("Producto actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setImages([]);
      setDeletedImageIds([]);
    },
    onError: () => {
      toast.error("Error al actualizar el producto");
    }
  });

  const handleRemoveExisting = (id: number) => {
      setExistingImages(prev => prev.filter(img => img.id !== id));
      setDeletedImageIds(prev => [...prev, id]);
  };

  const handleMoveExisting = (index: number, direction: "left" | "right") => {
      if (direction === "left" && index === 0) return;
      if (direction === "right" && index === existingImages.length - 1) return;

      const newImages = [...existingImages];
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      
      // Swap elements
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      
      // Update orden based on new index
      const reorderedImages = newImages.map((img, idx) => ({ ...img, orden: idx }));
      
      setExistingImages(reorderedImages);
  };

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={className} onClick={() => setIsModalOpen(true)}>
            <PencilIcon className="size-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
            <DialogDescription>
              Modifica los detalles del producto.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            product={product}
            handleSubmit={handleSubmit} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            images={images} 
            setImages={setImages}
            existingImages={existingImages}
            onRemoveExisting={handleRemoveExisting}
            onMoveExisting={handleMoveExisting}
            color={color}
            setColor={setColor}
            status={status}
            setStatus={setStatus}
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
        <Button variant="ghost" size="icon" className={className} onClick={() => setIsModalOpen(true)}>
            <PencilIcon className="size-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="!max-h-[90dvh] !h-[90dvh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar producto</DrawerTitle>
          <DrawerDescription>
            Modifica los detalles del producto.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <ProductForm 
            product={product}
            handleSubmit={handleSubmit} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            images={images} 
            setImages={setImages}
            existingImages={existingImages}
            onRemoveExisting={handleRemoveExisting}
            onMoveExisting={handleMoveExisting}
            color={color}
            setColor={setColor}
            status={status}
            setStatus={setStatus}
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
  product,
  handleSubmit,
  categories,
  selectedCategory,
  setSelectedCategory,
  images,
  setImages,
  existingImages,
  onRemoveExisting,
  onMoveExisting,
  color,
  setColor,
  status,
  setStatus,
  mutation,
  onCancel,
  className
}: {
  product: Product;
  handleSubmit: (formData: FormData) => void;
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
  existingImages: { id: number; url: string; orden: number }[];
  onRemoveExisting: (id: number) => void;
  onMoveExisting: (index: number, direction: "left" | "right") => void;
  color: string;
  setColor: (color: string) => void;
  status: string;
  setStatus: (status: string) => void;
  mutation: any;
  onCancel: () => void;
  className?: string;
}) {
  return (
    <form action={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input type="text" name="nombre" id="nombre" defaultValue={product.nombre} placeholder="Nombre del producto" />
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
        <Input type="text" name="descripcion" id="descripcion" defaultValue={product.descripcion} placeholder="Descripción" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Precio</Label>
          <Input type="number" name="precio" id="precio" defaultValue={product.precio} placeholder="0.00" step={0.01} />
        </div>
        <div>
          <Label htmlFor="inventario">Inventario</Label>
          <Input type="number" name="inventario" id="inventario" defaultValue={product.inventario} placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marca">Marca</Label>
          <Input type="text" name="marca" id="marca" defaultValue={product.marca} placeholder="Marca" />
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
        <Label htmlFor="real_status">Estado</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="agotado">Agotado</SelectItem>
            <SelectItem value="pausado">Pausado</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="real_status" value={status} />
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input type="text" name="sku" id="sku" defaultValue={product.sku} placeholder="SKU" />
      </div>

      <div>
        <Label>Imágenes</Label>
        <ImageUpload 
            value={images} 
            onChange={setImages} 
            existingImages={existingImages}
            onRemoveExisting={onRemoveExisting}
            onMoveExisting={onMoveExisting}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" size="sm" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button size="sm" loading={mutation.isPending} disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
