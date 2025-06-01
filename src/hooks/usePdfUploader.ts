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

export const usePdfUploader = ({ token, userId, onClose }: UsePdfUploaderProps & { onClose?: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [isUploading, setUploading] = useState(false);
    const { user } = useAuthStore();
    const { setTemplates } = useDocumentStore();

    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            setFileURL(URL.createObjectURL(uploadedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file || !token || !userId) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => (reader.onload = resolve));

            const payload = {
                name: file.name,
                description: `Dokumen ${file.name} Dibuat Oleh ${user?.fullname}`,
                example_file: reader.result as string,
                version: "1.0",
                created_by: userId,
            };

            await uploadPdfTemplate(payload, token);
            const updatedTemplates = await fetchAllPdfTemplates(token);
            setTemplates(updatedTemplates); 
            toast.success("Berhasil upload template");
            if (onClose) onClose();
        } catch (error) {
            console.error("Gagal upload template:", error);
            toast.error("Gagal mengupload dokumen.");
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