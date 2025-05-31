"use client";

import React from "react";
import Button from "@/components/ui/button/Button";
import DropzoneComponent from "@/components/form/form-elements/DropZone";

type PdfUploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    file: File | null;
    fileURL: string | null;
    isUploading: boolean;
    onDrop: (files: File[]) => void;
    onCancel: () => void;
};

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    file,
    fileURL,
    isUploading,
    onDrop,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[500px] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Upload Template Dokumen</h2>
                {fileURL ? (
                    <>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            File terpilih: <span className="font-medium">{file?.name}</span>
                        </p>

                        {/* Area preview dengan scroll */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
                            <h4 className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-white">
                                Preview Dokumen
                            </h4>
                            <div className="h-[400px] overflow-y-auto">
                                <iframe
                                    src={fileURL}
                                    className="w-full h-full border-0"
                                    title="PDF Preview"
                                />
                            </div>
                        </div>

                        {/* Tombol Cancel Upload */}
                        <Button
                            onClick={onCancel}
                            variant="danger"
                            className="w-full mb-4"
                        >
                            Cancel Upload
                        </Button>
                    </>
                ) : (
                    // Dropzone
                    <DropzoneComponent onDrop={onDrop} fileURL={fileURL} />
                )}

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="dark:text-white"
                    >
                        Tutup
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!file || isUploading}
                        className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition ${!file ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isUploading ? "Mengupload..." : "Simpan"}
                    </Button>
                </div>
            </div>
        </div>
    );
};