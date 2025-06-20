// src/components/modal/PdfUploadModal.tsx

"use client";

import React, { useState, useEffect } from "react";
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
    documentName: string;
    setDocumentName: (name: string) => void;
    documentDescription: string;
    setDocumentDescription: (description: string) => void;
    pageSignature: number | null;
    setPageSignature: (page: number | null) => void;
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
    documentName,
    setDocumentName,
    documentDescription,
    setDocumentDescription,
    pageSignature,
    setPageSignature,
}) => {
    if (!isOpen) return null;

    // Perbaikan logic reset saat modal ditutup
    useEffect(() => {
        if (!isOpen) {
            setDocumentName('');
            setDocumentDescription('');
            setPageSignature(null);
        }
    }, [isOpen, setDocumentName, setDocumentDescription, setPageSignature]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70 backdrop-blur-sm">
            <div className="p-6 rounded-lg shadow-xl w-full max-w-md max-h-[500px] overflow-y-auto bg-gray-100 dark:bg-gray-800">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Upload Template Dokumen</h2>

                {/* Input untuk Nama Dokumen */}
                <div className="mb-4">
                    <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Dokumen
                    </label>
                    <input
                        type="text"
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Masukkan nama dokumen"
                    />
                </div>

                {/* Input untuk Deskripsi Dokumen */}
                <div className="mb-4">
                    <label htmlFor="documentDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Deskripsi
                    </label>
                    <textarea
                        id="documentDescription"
                        value={documentDescription}
                        onChange={(e) => setDocumentDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y"
                        placeholder="Masukkan deskripsi dokumen"
                    ></textarea>
                </div>

                {/* Input untuk Page Signature */}
                <div className="mb-4">
                    <label htmlFor="pageSignature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Halaman Tanda Tangan
                    </label>
                    <input
                        type="number"
                        id="pageSignature"
                        // Perbaiki nilai input: Tampilkan '' jika null, jika tidak tampilkan angka
                        value={pageSignature !== null ? pageSignature : ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Perbaiki logic onChange: Set ke null jika string kosong, jika tidak parse sebagai angka
                            setPageSignature(value === '' ? null : Math.max(1, parseInt(value)));
                        }}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Nomor halaman untuk tanda tangan (misal: 1)"
                    />
                </div>

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
                        disabled={!file || isUploading || !documentName || !documentDescription || pageSignature === null}
                        className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition ${(!file || !documentName || !documentDescription || pageSignature === null) ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isUploading ? "Mengupload..." : "Simpan"}
                    </Button>
                </div>
            </div>
        </div>
    );
};