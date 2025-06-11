"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useSignatureStore } from "@/lib/stores/useSignatureStore";
import { useSignatureDrawer } from "@/hooks/useSignatureDrawer";
import { saveUserSignature } from "@/lib/services/signatureService";
import { canvasToFile } from "@/utils/file.utils";
import LoadingSpinner from "../ui/loading/LoadingSpinner";
import { SignatureModalProps } from "@/types/signature.types";


export const SignatureModal = ({
    isOpen,
    onClose,
    onSuccessUpload
}: SignatureModalProps) => {
    const { token, user } = useAuthStore();
    const ownerId = user?.id;

    const { signature, setSignature } = useSignatureStore();
    const [loading, setLoading] = useState(false);

    const handleDrawEnd = (dataUrl: string | null) => {
        setSignature(dataUrl);
    };

    const { canvasRef, startDrawing, draw, endDrawing, clearCanvas } = useSignatureDrawer({
        onDrawEnd: handleDrawEnd,
    });

    const handleSubmit = async () => {
        if (!canvasRef.current || !token || !ownerId || !user?.id) {
            toast.error("Data tidak lengkap");
            return;
        }
        setLoading(true);

        try {
            const signatureFile = await canvasToFile(canvasRef.current);
            const formData = new FormData();
            formData.append("file", signatureFile);
            formData.append("owner", user.id.toString());

            await saveUserSignature(formData, token);

            toast.success("Tanda tangan berhasil disimpan!");
            onClose();

            onSuccessUpload?.();
        } catch (error) {
            console.error("Gagal menyimpan tanda tangan:", error);
            toast.error("Gagal menyimpan tanda tangan.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="mb-4 text-sm font-semibold dark:text-white">Buat Tanda Tangan</h3>

                <div className="relative mb-4">
                    <canvas
                        ref={canvasRef}
                        width={350}
                        height={150}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                        className="border border-gray-300 rounded bg-white w-full"
                    />

                    {signature && (
                        <button
                            onClick={clearCanvas}
                            className="absolute top-1 right-1 rounded-full px-2 py-1 text-xs text-red-600 hover:text-red-800"
                        >
                            ❌ Clear
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!signature || loading} // disable saat loading atau tidak ada signature
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            "Simpan"
                        )}
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