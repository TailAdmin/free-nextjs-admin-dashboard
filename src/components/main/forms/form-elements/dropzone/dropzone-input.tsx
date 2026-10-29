"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadIcon, TrashBinIcon, EyeIcon } from "@/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileWithPreview extends File {
  preview?: string;
}

export default function DropzoneInput() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [previewImage, setPreviewImage] = useState<FileWithPreview | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Keep a ref pointing to latest files for unmount cleanup
  const filesRef = useRef<FileWithPreview[]>(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      ),
    ]);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const target = prevFiles.find((f) => f.name === fileName);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prevFiles.filter((f) => f.name !== fileName);
    });
  };

  const handleOpenPreview = (file: FileWithPreview) => {
    setPreviewImage(file);
    setIsPreviewOpen(true);
  };

  // Revoke all object URLs only when unmounting to prevent memory leaks
  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const getBorderColor = () => {
    if (isDragReject)
      return "border-error-500 bg-error-50/60 dark:bg-error-950/20";
    if (isDragAccept)
      return "border-brand-500 bg-brand-50/60 dark:bg-brand-950/20";
    if (isFocused)
      return "border-brand-500 ring-2 ring-brand-500/20 bg-gray-50 dark:bg-gray-900";
    return "border-gray-300 bg-gray-50 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-7 text-center transition-all duration-200 outline-hidden lg:p-10 ${getBorderColor()}`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          {/* Circular Upload Icon */}
          <div className="mb-4 flex size-17 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <UploadIcon className="size-7 text-current" />
          </div>

          {/* Heading */}
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            {isDragReject
              ? "File type not supported"
              : isDragAccept
              ? "Drop images here"
              : isDragActive
              ? "Drop files here"
              : "Drop File Here"}
          </h4>

          {/* Subtitle */}
          <p className="mb-4 max-w-72.5 text-sm text-gray-700 dark:text-gray-400">
            {isDragReject
              ? "Only PNG, JPG, WebP, and SVG images up to 5MB are allowed"
              : "Drag and drop your PNG, JPG, WebP, SVG images here or browse"}
          </p>

          {/* Browse Action */}
          <span className="text-sm font-medium text-brand-500 underline hover:text-brand-600">
            Browse File
          </span>
        </div>
      </div>

      {/* Uploaded Images Preview Gallery */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Images ({files.length})
            </h5>
            <button
              type="button"
              onClick={() => {
                files.forEach((f) => {
                  if (f.preview) URL.revokeObjectURL(f.preview);
                });
                setFiles([]);
              }}
              className="text-xs font-medium text-error-500 hover:text-error-600 dark:text-error-400"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {files.map((file) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs transition hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {file.preview ? (
                    <Image
                      src={file.preview}
                      alt={file.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <UploadIcon className="size-8" />
                    </div>
                  )}

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {file.preview && (
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(file)}
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-800 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                        title="Preview image"
                        aria-label={`Preview ${file.name}`}
                      >
                        <EyeIcon className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error-500 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-error-400 dark:hover:bg-gray-800"
                      title="Remove image"
                      aria-label={`Remove ${file.name}`}
                    >
                      <TrashBinIcon className="size-4" />
                    </button>
                  </div>
                </div>

                {/* File Metadata */}
                <div className="p-3">
                  <p
                    className="truncate text-xs font-medium text-gray-800 dark:text-white/90"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl p-6 sm:p-8">
          {previewImage && (
            <div>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Image Preview
                </DialogTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {previewImage.name} • {formatFileSize(previewImage.size)}
                </p>
              </DialogHeader>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                {previewImage.preview && (
                  <Image
                    src={previewImage.preview}
                    alt={previewImage.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
