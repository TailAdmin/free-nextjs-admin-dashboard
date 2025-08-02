// src/components/documents/ProcessPdfEditor.tsx
"use client"

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
    const pageRef = useRef<HTMLDivElement>(null);
    const [signatureFieldsLocal, setSignatureFieldsLocal] = useState<SignatureField[]>([]);
    const { token } = useAuthStore();
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageScale, setPageScale] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [originalPageWidth, setOriginalPageWidth] = useState<number>(794); // A4 width at 96dpi

    // Store relative positions (0-1 range) for responsive behavior
    const [relativePositions, setRelativePositions] = useState<Map<string, { 
        x: number; 
        y: number; 
        page: number;
        relativeX: number;
        relativeY: number;
    }>>(new Map());

    const calculateScale = useCallback(() => {
        if (pdfContainerRef.current) {
            const container = pdfContainerRef.current;
            const availableWidth = container.offsetWidth - 40; // Account for padding
            const maxWidth = Math.min(availableWidth, 800); // Set reasonable max width
            setContainerWidth(maxWidth);
            
            const scale = maxWidth / originalPageWidth;
            setPageScale(scale);
            return scale;
        }
        return 1;
    }, [originalPageWidth]);

    // Handle window resize with debouncing
    useEffect(() => {
        const debouncedResize = debounce(() => {
            calculateScale();
        }, 150);

        window.addEventListener('resize', debouncedResize);
        calculateScale();

        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    }, [calculateScale]);

    // Update display positions when scale changes
    useEffect(() => {
        const updatedRelativePositions = new Map();
        
        signatureFieldsLocal.forEach(field => {
            // Calculate relative positions (0-1 range)
            const relativeX = field.pos_x / originalPageWidth;
            const relativeY = field.pos_y / (originalPageWidth * 1.414); // A4 aspect ratio
            
            // Calculate display positions based on current scale
            const displayX = relativeX * containerWidth;
            const displayY = relativeY * (containerWidth * 1.414);
            
            updatedRelativePositions.set(field.category, {
                x: displayX,
                y: displayY,
                page: field.page_signature,
                relativeX,
                relativeY
            });
        });

        setRelativePositions(updatedRelativePositions);
    }, [pageScale, signatureFieldsLocal, containerWidth, originalPageWidth]);

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

    const onPageLoadSuccess = useCallback((page: any) => {
        // Get actual page dimensions
        const pageWidth = page.originalWidth || 794;
        const pageHeight = page.originalHeight || pageWidth * 1.414;
        
        setOriginalPageWidth(pageWidth);
        calculateScale();
    }, [calculateScale]);

    const onDocumentLoadError = useCallback((error: any) => {
        console.error("Error loading PDF:", error);
        toast.error("Gagal memuat pratinjau PDF.");
        setPdfLoading(false);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!pageRef.current) return;
        
        const rect = pageRef.current.getBoundingClientRect();
        if (!rect) return;

        // Get click position relative to the page
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert to relative coordinates (0-1 range)
        const relativeX = clickX / rect.width;
        const relativeY = clickY / rect.height;

        // Convert relative coordinates to PDF coordinates
        const pdfX = Math.round(relativeX * originalPageWidth);
        const pdfY = Math.round(relativeY * (originalPageWidth * 1.414));

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
                pos_x: pdfX,
                pos_y: pdfY,
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
        setRelativePositions(new Map());
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Letakkan Tanda Tangan
            </h3>
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
                        <div 
                            ref={pageRef}
                            className="relative cursor-crosshair" 
                            onClick={handleClick}
                        >
                            <Page
                                pageNumber={currentPage}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                onLoadSuccess={onPageLoadSuccess}
                            />

                            {/* Responsive signature position indicators */}
                            {Array.from(relativePositions.entries()).map(([category, pos]) => (
                                pos.page === currentPage && (
                                    <div
                                        key={category}
                                        className={`absolute flex items-center space-x-1 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg z-10 transition-all duration-200 ${
                                            category === "Petugas" ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                                        }`}
                                        style={{
                                            left: `${pos.x}px`,
                                            top: `${pos.y}px`,
                                            transform: 'translate(-50%, -50%)',
                                            cursor: 'pointer'
                                        }}
                                        title={`${category} - Klik untuk menghapus`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const updatedFields = signatureFieldsLocal.filter(f => f.category !== category);
                                            setSignatureFieldsLocal(updatedFields);
                                            onSignatureFieldsChange(updatedFields);
                                            toast.info(`Posisi ${category} telah dihapus.`);
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
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
                Responsive pada semua ukuran layar desktop. Posisi tanda tangan akan menyesuaikan otomatis.
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
                    Simpan Posisi ({signatureFieldsLocal.length}/2)
                </button>
                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                    Reset
                </button>
            </div>

            {/* Status indicator */}
            {signatureFieldsLocal.length > 0 && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {signatureFieldsLocal.map(field => (
                        <span key={field.category} className="inline-block mx-2">
                            ✅ {field.category} (Hal. {field.page_signature})
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// Utility function for debouncing resize events
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}