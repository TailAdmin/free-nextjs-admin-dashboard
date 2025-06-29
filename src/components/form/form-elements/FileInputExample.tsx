"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput"; // Pastikan path ini benar
import Label from "../Label"; // Pastikan path ini benar

export default function FileInputExample() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedImageTypes.includes(file.type)) {
        console.log("Selected image file:", file.name);
      } else {
        console.warn("File yang dipilih bukan file gambar yang diizinkan:", file.name);
        alert("Mohon pilih file gambar (JPG, PNG, GIF, WEBP).");
        event.target.value = ''; // Reset input file
      }
    }
  };

  return (
    <ComponentCard title="File Input (Gambar Saja)">
      <div>
        <Label>Upload Gambar</Label>
        {/* Pastikan komponen FileInput Anda menerima prop 'accept' */}
        <FileInput
          onChange={handleFileChange}
          className="custom-class"
          accept="image/jpeg, image/png, image/gif, image/webp"
        />
      </div>
    </ComponentCard>
  );
}