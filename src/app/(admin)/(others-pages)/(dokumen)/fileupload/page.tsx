"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { usePdfUploader } from "@/hooks/usePdfUploader";
import { PdfUploadModal } from "@/components/modal/PdfUploadModal";
import Button from "@/components/ui/button/Button";

export default function FileUploadPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token, user } = useAuthStore();

    const {
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
    } = usePdfUploader({
        token,
        userId: user?.id ?? null,
    });

    const onSubmit = async () => {
        const result = await handleSubmit();
        if (result) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    Upload Template
                </Button>
            </div>

            {isModalOpen && (
                <PdfUploadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={onSubmit}
                    onDrop={handleDrop}
                    onCancel={handleCancelUpload}
                    file={file}
                    fileURL={fileURL}
                    isUploading={isUploading}
                    documentName={documentName}       
                    setDocumentName={setDocumentName}   
                    documentDescription={documentDescription} 
                    setDocumentDescription={setDocumentDescription}
                    pageSignature={pageSignature}      
                    setPageSignature={setPageSignature}   
                />
            )}
        </>
    );
}