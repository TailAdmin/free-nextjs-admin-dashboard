"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { saveUserSignature } from "@/lib/services/signatureService";
import LoadingSpinner from "../ui/loading/LoadingSpinner";
import { SignatureModalProps } from "@/types/signature.types";
import { dataUrlToFile } from "@/utils/file.utils";
import CustomSignaturePad from "../canvas/SignaturePad";

export const SignatureModal = ({
    isOpen,
    onClose,
    onSuccessUpload,
}: SignatureModalProps) => {
    const { token, user } = useAuthStore();
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSaveSignature = async () => {
        if (!signatureDataUrl || !token || !user?.id) {
            toast.error("Data tidak lengkap");
            return;
        }

        setLoading(true);
        try {
            const file = dataUrlToFile(signatureDataUrl, "signature.png");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("owner", user.id.toString());

            await saveUserSignature(formData, token);

            toast.success("Tanda tangan berhasil disimpan!");
            onClose();
            onSuccessUpload?.();
        } catch (err) {
            console.error("Gagal menyimpan tanda tangan:", err);
            toast.error("Gagal menyimpan tanda tangan.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="mb-4 text-sm font-semibold dark:text-white">
                    Buat Tanda Tangan
                </h3>

                <CustomSignaturePad onSave={setSignatureDataUrl} />

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleSaveSignature}
                        disabled={!signatureDataUrl || loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : "Simpan"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};
