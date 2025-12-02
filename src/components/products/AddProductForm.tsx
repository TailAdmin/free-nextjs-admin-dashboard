
"use client";

import { createProduct } from "@/actions/product";
import {Input} from "@/components/ui/input"

import Label from "../form/Label";
import { useEffect } from "react";
import { Combobox } from "../ui/combobox";
import { useState } from "react";
import { Button } from "../ui/button";

// Category type
type Category = { id: number; name: string };

export default function AddProductForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
    fetchCategories();
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      // Add selectedCategory to formData
      if (selectedCategory !== null) {
        formData.append("id_category", selectedCategory.toString());
      } else {
        formData.append("id_category", ""); // Ensure it's present even if null
      }
      await createProduct(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Agregar un nuevo producto</h2>
      
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
        <Input type="text" name="descripcion" id="descripcion" placeholder="Descripción del producto" />
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
          <Input type="text" name="marca" id="marca" placeholder="Marca del producto" />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input type="text" name="color" id="color" placeholder="Color del producto" />
        </div>
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input type="text" name="sku" id="sku" placeholder="SKU del producto" />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" size="sm" variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button size="sm" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
}
