import { useState } from "react";
import { uploadPdfTemplate } from "@/lib/services/pdfTemplateService";
import { DocTemplatePayload } from "@/types/pdfTemplate.types";
import { useAuthStore } from "@/lib/stores/useAuthStore";

interface UsePdfUploaderProps {
    token: string | null;
    userId: number | null;
}

export const usePdfUploader = ({ token, userId }: UsePdfUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [isUploading, setUploading] = useState(false);
    const { user } = useAuthStore();

    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);

            const reader = new FileReader();
            reader.onload = (e) => {
                const blob = new Blob([e.target?.result as ArrayBuffer], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setFileURL(url);
            };
            reader.readAsArrayBuffer(uploadedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file || !token || !userId) return;

        setUploading(true);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => (reader.onload = resolve));

            const base64File = reader.result as string;

            const payload: DocTemplatePayload = {
                name: file.name,
                description: `Dokumen ${file.name} Dibuat Oleh ${user?.fullname}`,
                example_file: base64File,
                version: "1.0",
                created_by: userId,
            };

            const result = await uploadPdfTemplate(payload, token);

            return result;
        } catch (error) {
            console.error("Error uploading file:", error);

            alert("Terjadi kesalahan saat mengupload dokumen. Cek konsol untuk detail.");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleCancelUpload = () => {
        setFile(null);
        setFileURL(null);
    };

    return {
        file,
        fileURL,
        isUploading,
        handleDrop,
        handleSubmit,
        handleCancelUpload,
    };
};