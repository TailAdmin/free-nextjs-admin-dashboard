"use client";
import React, { useRef, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import FileInput2 from "@/components/form/input/FileInput2";
import Button from "@/components/ui/button/Button";
import Label from "../Label";

export default function FileInputExample() {
  const selfieRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ selfie: File | null }>({ selfie: null });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <ComponentCard title="File Input">
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
      </div>
      <div>
        <Label>Upload file (2)</Label>
        <FileInput2
          ref={selfieRef}
          accept="image/*"
          onChange={(evt) => setFiles((prev) => ({ ...prev, selfie: evt.target.files?.[0] || null }))}
          className="custom-class"
          disabled={false}
        />
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => {
            if (!files.selfie) {
              alert("No file selected");
            } else {
              alert(`Selected file: ${files.selfie.name}`);
            }
          }}
        >
          Check Selected File
        </Button>
      </div>
    </ComponentCard>
  );
}
