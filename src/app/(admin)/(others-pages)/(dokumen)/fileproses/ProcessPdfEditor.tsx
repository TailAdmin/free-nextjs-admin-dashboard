// src/components/documents/ProcessPdfEditor.tsx
"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import {
    DocTemplateResponse,
    SignatureField,
    ProcessPdfEditorProps,
} from "@/types/pdfTemplate.types";
import { updateDocWithSignatures } from "@/lib/services/pdfTemplateService";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ProcessPdfEditor({
    doc,
    onSaveSuccess,
    onSignatureFieldsChange,
    initialSignatureFields,
}: ProcessPdfEditorProps) {
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const [signatureFieldsLocal, setSignatureFieldsLocal] = useState<SignatureField[]>([]);
    const { token } = useAuthStore();
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageScale, setPageScale] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const [displayPositions, setDisplayPositions] = useState<Map<string, { x: number; y: number; page: number }>>(new Map());

    const calculateScale = useCallback(() => {
        if (pdfContainerRef.current) {
            const container = pdfContainerRef.current;
            const width = container.offsetWidth - 20;
            setContainerWidth(width);
            const scale = width / 794; // A4 width in pixels at 96dpi
            setPageScale(scale);
            return scale;
        }
        return 1;
    }, []);

    useEffect(() => {
        const handleResize = () => {
            calculateScale();
        };

        window.addEventListener('resize', handleResize);
        calculateScale();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateScale]);

    useEffect(() => {
        const updatedDisplayPositions = new Map<string, { x: number; y: number; page: number }>();
        
        signatureFieldsLocal.forEach(field => {
            updatedDisplayPositions.set(field.category, {
                x: field.pos_x * pageScale,
                y: field.pos_y * pageScale,
                page: field.page_signature
            });
        });

        setDisplayPositions(updatedDisplayPositions);
    }, [pageScale, signatureFieldsLocal]);

    useEffect(() => {
        if (JSON.stringify(initialSignatureFields) !== JSON.stringify(signatureFieldsLocal)) {
            setSignatureFieldsLocal(initialSignatureFields);
        }
    }, [initialSignatureFields]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfLoading(false);
        setCurrentPage(1);
        calculateScale();
    }, [calculateScale]);

    const onDocumentLoadError = useCallback((error: any) => {
        console.error("Error loading PDF:", error);
        toast.error("Gagal memuat pratinjau PDF.");
        setPdfLoading(false);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / pageScale;
        const y = (e.clientY - rect.top) / pageScale;

        let updatedFields = [...signatureFieldsLocal];
        let targetCategory: "Petugas" | "Penerima" | null = null;

        if (!updatedFields.some(f => f.category === "Petugas")) {
            targetCategory = "Petugas";
        } else if (!updatedFields.some(f => f.category === "Penerima")) {
            targetCategory = "Penerima";
        }

        if (targetCategory) {
            updatedFields = updatedFields.filter(f => f.category !== targetCategory);
            updatedFields.push({
                category: targetCategory,
                pos_x: Math.round(x),
                pos_y: Math.round(y),
                page_signature: currentPage
            });

            setSignatureFieldsLocal(updatedFields);
            onSignatureFieldsChange(updatedFields);
            
            toast.success(`Posisi ${targetCategory} berhasil ditentukan pada halaman ${currentPage}.`);
        } else {
            toast.warning("Anda sudah menentukan kedua posisi (Petugas dan Penerima).");
        }
    };

    const handleReset = () => {
        setSignatureFieldsLocal([]);
        onSignatureFieldsChange([]);
        setDisplayPositions(new Map());
        toast.info("Semua posisi tanda tangan telah direset.");
    };

    const handleSubmit = async () => {
        if (!token || !doc.id) {
            toast.error("Token atau ID dokumen tidak tersedia.");
            return;
        }
        if (signatureFieldsLocal.length < 2) {
            toast.warning("Silakan tambahkan 2 posisi tanda tangan sebelum menyimpan.");
            return;
        }

        try {
            await updateDocWithSignatures(doc.id.toString(), signatureFieldsLocal, token);
            toast.success("Tanda tangan berhasil disimpan.");
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error("Gagal menyimpan posisi tanda tangan:", error);
            toast.error("Gagal menyimpan posisi tanda tangan.");
        }
    };

    const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(numPages, prev + 1));

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Letakkan Tanda Tangan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Klik pada area PDF untuk menentukan posisi tanda tangan.
            </p>

            {/* PDF Viewer */}
            <div
                ref={pdfContainerRef}
                className="relative w-full max-w-4xl mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden"
                style={{ minHeight: '500px' }}
            >
                {pdfLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner message="Memuat pratinjau PDF..." />
                    </div>
                )}

                {doc.example_file ? (
                    <Document
                        file={doc.example_file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading=""
                    >
                        <div className="relative cursor-pointer" onClick={handleClick}>
                            <Page
                                pageNumber={currentPage}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />

                            {Array.from(displayPositions.entries()).map(([category, pos]) => (
                                pos.page === currentPage && (
                                    <div
                                        key={category}
                                        className={`absolute flex items-center space-x-1 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10 ${
                                            category === "Petugas" ? "bg-red-500" : "bg-green-600"
                                        }`}
                                        style={{
                                            left: `${pos.x}px`,
                                            top: `${pos.y}px`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                        <span>{category}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </Document>
                ) : (
                    !pdfLoading && (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            Tidak ada file PDF untuk ditampilkan.
                        </div>
                    )
                )}
            </div>

            {/* Pagination Controls */}
            {numPages > 0 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Sebelumnya
                    </button>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Halaman {currentPage} dari {numPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Berikutnya
                    </button>
                </div>
            )}

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Hanya halaman yang sedang dilihat yang ditampilkan.
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={signatureFieldsLocal.length < 2}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                        signatureFieldsLocal.length >= 2
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Simpan Posisi
                </button>
                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}