"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon } from "@/icons";
import React, { useRef } from "react";

export interface AvatarUploadSectionProps {
  previewAvatarUrl: string;
  fullName?: string;
  fallbackLetter?: string;
  onAvatarChange: (url: string) => void;
}

export default function AvatarUploadSection({
  previewAvatarUrl,
  fullName,
  fallbackLetter = "M",
  onAvatarChange,
}: AvatarUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        Change Profile Picture
      </h3>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <Avatar className="size-20 shrink-0 sm:size-24">
            <AvatarImage
              src={previewAvatarUrl}
              alt={fullName || "Profile avatar"}
            />
            <AvatarFallback className="bg-cyan-500 text-2xl font-medium text-white dark:bg-cyan-500 dark:text-white">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>

          {/* Overlaid Camera Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-e-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Upload profile picture"
          >
            <CameraIcon className="size-4.5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            className="hidden"
            id="avatar-file-input"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-normal">Upload a square image (200×200 px)</p>
          <p className="font-normal">in JPEG or PNG format.</p>
        </div>
      </div>
    </div>
  );
}
