import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import { uploadPdfTemplate, fetchAllPdfTemplates } from "@/lib/services/pdfTemplateService";
import { toast } from "sonner";

interface UsePdfUploaderProps {
    token: string | null;
    userId: number | null;
    onClose?: () => void;
}

export const usePdfUploader = ({ token, userId, onClose }: UsePdfUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [isUploading, setUploading] = useState(false);
    const { user } = useAuthStore();
    const { setTemplates } = useDocumentStore();

    const readFileAsync = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const uploadedFile = acceptedFiles[0];

        if (uploadedFile.type !== "application/pdf") {
            toast.error("Hanya file PDF yang diperbolehkan.");
            return;
        }

        setFile(uploadedFile);
        setFileURL(URL.createObjectURL(uploadedFile));
    };

    const handleSubmit = async (): Promise<boolean> => {
        if (!file || !token || !userId) {
            toast.error("File atau token tidak tersedia");
            return false;
        }

        setUploading(true);
        try {
            const fileData = await readFileAsync(file);

            const payload = {
                name: file.name,
                description: `Dokumen ${file.name} Dibuat Oleh ${user?.fullname}`,
                example_file: fileData,
                version: "1.0",
                created_by: userId,
            };

            await uploadPdfTemplate(payload, token);
            const updatedTemplates = await fetchAllPdfTemplates(token);
            setTemplates(updatedTemplates);

            toast.success("Berhasil upload template");
            if (onClose) onClose();

            return true;
        } catch (error) {
            console.error("Gagal upload template:", error);
            toast.error("Gagal mengupload dokumen.");
            return false;
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