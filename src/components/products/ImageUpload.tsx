"use client";

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { Eye, Trash2Icon, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge,badgeVariants  } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from "next/image";
import { cn } from '@/lib/utils';

export interface ExistingImage {
  id: number;
  url: string;
  orden: number;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  maxImages?: number;
  existingImages?: ExistingImage[];
  onRemoveExisting?: (id: number) => void;
  onMoveExisting?: (index: number, direction: 'left' | 'right') => void;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  multiple = true, 
  maxImages = 5,
  existingImages = [],
  onRemoveExisting,
  onMoveExisting
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync internal state with external value prop
    const newImages = value.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    // Only update if the files are different to avoid infinite loops
    if (newImages.length !== images.length || !newImages.every((img, i) => img.file === images[i]?.file)) {
         // Clean up old previews
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages(newImages);
    }

    return () => {
        // Cleanup on unmount or value change
    };
  }, [value]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentImageCount = value.length + existingImages.length;
    const remainingSlots = maxImages - currentImageCount;

    if (remainingSlots <= 0) {
      alert(`Ya has alcanzado el límite máximo de ${maxImages} imágenes`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newFiles = [...value, ...filesToProcess];
    onChange(newFiles);
    
    // Reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === value.length - 1) return;

    const newFiles = [...value];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    onChange(newFiles);
  };

  const clearAll = () => {
    onChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const sortedExisting = [...existingImages].sort((a, b) => a.orden - b.orden);
  const totalImagesCount = sortedExisting.length + images.length;

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="space-y-2">
        <div className="flex w-full items-center gap-2 flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            className={cn(`flex w-full items-center`, totalImagesCount > 0 ? 'justify-between !w-full' : 'justify-center', totalImagesCount > 0 && badgeVariants({ variant: 'secondary' }))}
            disabled={totalImagesCount >= maxImages}
          >
            <Upload className="mr-2 h-4 w-4" />

            <div className="flex w-full items-center justify-center">
              {totalImagesCount < 1 && <span>Subir Imágenes</span>}
              {totalImagesCount > 0 && (
               
                  <span>{totalImagesCount} / {maxImages} archivo{totalImagesCount !== 1 ? 's' : ''}</span>
              )}
            </div>
            {totalImagesCount < 1 && <Upload className="mr-2 h-4 w-4 text-transparent" />}
          </Button>

          {totalImagesCount > 0 && (
            <div className="flex  items-center gap-2 w-fit">
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size={"icon"}>
                    <Eye className="h-4 w-4 sm:w-fit" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  className={`z-50 mt-1 p-2 ${multiple ? 'w-80' : 'w-52'}`}
                >
                  <div className="space-y-3">
                    <div
                      className={`grid max-h-64 ${multiple ? 'grid-cols-2' : 'grid-cols-1'} gap-2 overflow-y-auto overflow-x-hidden p-1`}
                    >
                      {/* Existing Images */}
                      {sortedExisting.map((image, index) => (
                        <div key={`existing-${image.id}`} className="group relative">
                          <div className="relative h-20 w-full">
                             <Image
                                src={image.url || '/placeholder.svg'}
                                alt="Existing image"
                                fill
                                className="rounded-md border object-cover"
                              />
                          </div>
                          
                          <div className="absolute top-1 left-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                onMoveExisting?.(index, 'left');
                              }}
                              disabled={index === 0}
                              className="flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                onMoveExisting?.(index, 'right');
                              }}
                              disabled={index === sortedExisting.length - 1}
                              className="flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveExisting?.(image.id)}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-red-600 opacity-0 transition-colors hover:border-red-600 hover:text-red-700 group-hover:opacity-100"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 truncate rounded-b-md bg-black/50 p-1 text-xs text-white">
                            Existente
                          </div>
                        </div>
                      ))}

                      {/* New Images */}
                      {images.map((image, index) => (
                        <div key={image.id} className="group relative">
                          <div className="relative h-20 w-full">
                             <Image
                                src={image.preview || '/placeholder.svg'}
                                alt={image.file.name}
                                fill
                                className="rounded-md border object-cover"
                              />
                          </div>
                          
                          <div className="absolute top-1 left-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                moveImage(index, 'left');
                              }}
                              disabled={index === 0}
                              className="flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                moveImage(index, 'right');
                              }}
                              disabled={index === images.length - 1}
                              className="flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background text-xs text-red-600 opacity-0 transition-colors hover:border-red-600 hover:text-red-700 group-hover:opacity-100"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 truncate rounded-b-md bg-black/50 p-1 text-xs text-white">
                            {image.file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                type="button"
                variant="outline"
                onClick={clearAll}
                size={'default'}
                className="bg-transparent p-3 text-red-600 hover:text-red-700"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
