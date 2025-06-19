import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import { uploadPdfTemplate, fetchAllPdfTemplates } from "@/lib/services/pdfTemplateService";
import { toast } from "sonner";
import { DocTemplatePayload, SignatureField } from "@/types/pdfTemplate.types";

interface UsePdfUploaderProps {
    token: string | null;
    userId: number | null;
    onClose?: () => void;
}

export const usePdfUploader = ({ token, userId, onClose }: UsePdfUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [isUploading, setUploading] = useState(false);
    const [documentName, setDocumentName] = useState<string>("");
    const [documentDescription, setDocumentDescription] = useState<string>("");
    const [pageSignature, setPageSignature] = useState<number | null>(null);

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
        ;
        }

        setFile(uploadedFile);
        setFileURL(URL.createObjectURL(uploadedFile));
        if (!documentName) {
            setDocumentName(uploadedFile.name.replace(/\.pdf$/i, ''));
        }
    };

    const handleSubmit = async (): Promise<boolean> => {
        if (!file || !token || !userId || !documentName || !documentDescription || pageSignature === null) {
            toast.error("Semua kolom harus diisi dan file harus dipilih.");
            return false;
        }

        setUploading(true);
        try {
            const signatureFields: SignatureField[] = pageSignature !== null ? [{
                category: "default_signature",
                pos_x: 0,
                pos_y: 0,
                page_signature: pageSignature,
            }] : [];

            const payload: DocTemplatePayload = {
                name: documentName,
                description: documentDescription,
                
                example_file: file.name, 
                version: "1.0",
                created_by: userId,
                signature_fields: signatureFields,
            };

            await uploadPdfTemplate(payload, token, file); 

            const updatedTemplates = await fetchAllPdfTemplates(token);
            setTemplates(updatedTemplates);

            toast.success("Berhasil upload template");
            if (onClose) onClose();

            setFile(null);
            setFileURL(null);
            setDocumentName("");
            setDocumentDescription("");
            setPageSignature(null);

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
        setDocumentName("");
        setDocumentDescription("");
        setPageSignature(null);
    };

    return {
        file,
        fileURL,
        isUploading,
        handleDrop,
        handleSubmit,
        handleCancelUpload,
        documentName,
        setDocumentName,
        documentDescription,
        setDocumentDescription,
        pageSignature,
        setPageSignature,
    };
};