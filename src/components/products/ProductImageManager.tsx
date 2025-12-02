"use client";

import { deleteProductImage, updateImageOrder } from "@/actions/product";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TrashIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  id: number;
  url: string;
  orden: number;
};

export default function ProductImageManager({ images, productId }: { images: ProductImage[]; productId: number }) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const sortedImages = [...images].sort((a, b) => a.orden - b.orden);

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => deleteProductImage(imageId),
    onSuccess: () => {
      toast.success("Imagen eliminada");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Error al eliminar imagen");
      setDeletingId(null);
    },
  });

  const orderMutation = useMutation({
    mutationFn: ({ imageId, newOrder }: { imageId: number; newOrder: number }) => updateImageOrder(imageId, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setUpdatingId(null);
    },
    onError: () => {
      toast.error("Error al actualizar orden");
      setUpdatingId(null);
    },
  });

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sortedImages.length - 1) return;

    const currentImage = sortedImages[index];
    const swapImage = sortedImages[direction === "up" ? index - 1 : index + 1];

    setUpdatingId(currentImage.id);
    
    // Optimistic update logic could be added here, but for simplicity we'll just trigger mutations
    // We need to swap their orders. 
    // Note: This simple swap assumes orders are sequential. If not, logic needs to be more robust.
    // For now, let's just swap their 'orden' values.
    
    orderMutation.mutate({ imageId: currentImage.id, newOrder: swapImage.orden });
    orderMutation.mutate({ imageId: swapImage.id, newOrder: currentImage.orden });
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Imágenes Actuales</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sortedImages.map((image, index) => (
          <div key={image.id} className="relative group rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt="Product image"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                disabled={index === 0 || updatingId !== null}
                onClick={() => handleMove(index, "up")}
              >
                <ArrowUpIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                disabled={index === sortedImages.length - 1 || updatingId !== null}
                onClick={() => handleMove(index, "down")}
              >
                <ArrowDownIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                disabled={deletingId === image.id}
                onClick={() => {
                  setDeletingId(image.id);
                  deleteMutation.mutate(image.id);
                }}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
            {image.orden === 0 && (
                <div className="absolute top-1 left-1 bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    Principal
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
