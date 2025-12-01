"use client";

import { createProduct } from "@/actions/product";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState } from "react";
import { Button } from "../ui/button";

export default function AddProductForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
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
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Product</h2>
      
      <div>
        <Label htmlFor="nombre">Name</Label>
        <Input type="text" name="nombre" id="nombre" placeholder="Product Name" />
      </div>

      <div>
        <Label htmlFor="descripcion">Description</Label>
        <Input type="text" name="descripcion" id="descripcion" placeholder="Description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Price</Label>
          <Input type="number" name="precio" id="precio" placeholder="0.00" step={0.01} />
        </div>
        <div>
          <Label htmlFor="inventario">Inventory</Label>
          <Input type="number" name="inventario" id="inventario" placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marca">Brand</Label>
          <Input type="text" name="marca" id="marca" placeholder="Brand" />
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
        <Button type="button" size="sm" variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button size="sm" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
