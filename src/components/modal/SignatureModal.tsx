"use client";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { saveUserSignature } from "@/lib/services/signatureService";
import LoadingSpinner from "../ui/loading/LoadingSpinner";
import { SignatureModalProps } from "@/types/signature.types";
import { dataUrlToFile } from "@/utils/file.utils";
import CustomSignaturePad from "../canvas/SignaturePad";

type SignatureMode = "draw" | "upload";

export const SignatureModal = ({
    isOpen,
    onClose,
    onSuccessUpload,
}: SignatureModalProps) => {
    const { token, user } = useAuthStore();
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<SignatureMode>("draw");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.includes("png")) {
            toast.error("Hanya file PNG yang diperbolehkan");
            return;
        }

        // Validate file size (optional - adjust limit as needed)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Ukuran file terlalu besar. Maksimal 5MB");
            return;
        }

        setUploadedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setSignatureDataUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSignature = async () => {
        if (!token || !user?.id) {
            toast.error("Data tidak lengkap");
            return;
        }

        // Check if we have signature data
        if (mode === "draw" && !signatureDataUrl) {
            toast.error("Silakan buat tanda tangan terlebih dahulu");
            return;
        }

        if (mode === "upload" && !uploadedFile) {
            toast.error("Silakan pilih file tanda tangan");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            
            if (mode === "draw" && signatureDataUrl) {
                const file = dataUrlToFile(signatureDataUrl, "signature.png");
                formData.append("file", file);
            } else if (mode === "upload" && uploadedFile) {
                formData.append("file", uploadedFile);
            }
            
            formData.append("owner", user.id.toString());
            
            // Debug FormData contents
            // console.log("=== FormData Debug ===");
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value);
            //     if (value instanceof File) {
            //         console.log(`File details - Name: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
            //     }
            // }
            
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

    const handleModeChange = (newMode: SignatureMode) => {
        setMode(newMode);
        setSignatureDataUrl(null);
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isSignatureReady = () => {
        return (mode === "draw" && signatureDataUrl) || 
               (mode === "upload" && uploadedFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="mb-4 text-sm font-semibold dark:text-white">
                    Buat Tanda Tangan
                </h3>

                {/* Mode Selection */}
                <div className="mb-4">
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button
                            onClick={() => handleModeChange("draw")}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                mode === "draw"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            Gambar
                        </button>
                        <button
                            onClick={() => handleModeChange("upload")}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                mode === "upload"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                {/* Content based on mode */}
                {mode === "draw" ? (
                    <CustomSignaturePad onSave={setSignatureDataUrl} />
                ) : (
                    <div className="space-y-4">
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".png,image/png"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="signature-upload"
                            />
                            <label
                                htmlFor="signature-upload"
                                className="block w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition-colors text-center"
                            >
                                <div className="space-y-2">
                                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            Klik untuk upload
                                        </span>{" "}
                                        atau drag & drop
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        File PNG (maksimal 5MB)
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Preview uploaded signature */}
                        {signatureDataUrl && uploadedFile && (
                            <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Preview:
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {uploadedFile.name}
                                    </span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded p-2 border">
                                    <img
                                        src={signatureDataUrl}
                                        alt="Signature preview"
                                        className="max-h-20 mx-auto"
                                        style={{ maxWidth: "100%" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleSaveSignature}
                        disabled={!isSignatureReady() || loading}
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