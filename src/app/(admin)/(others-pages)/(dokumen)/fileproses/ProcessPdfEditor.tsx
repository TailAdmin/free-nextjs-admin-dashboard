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

const DEFAULT_PDF_RENDER_WIDTH_PX = 794;

// --- Ubah interface props untuk menerima initialSignatureFields ---
interface ExtendedProcessPdfEditorProps extends ProcessPdfEditorProps {
    initialSignatureFields: SignatureField[];
}

export default function ProcessPdfEditor({
    doc,
    onSaveSuccess,
    onSignatureFieldsChange,
    initialSignatureFields, // Terima prop baru
}: ExtendedProcessPdfEditorProps) {
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    // Inisialisasi signatureFieldsLocal dari prop awal, bukan dari doc secara langsung di sini
    const [signatureFieldsLocal, setSignatureFieldsLocal] = useState<SignatureField[]>(initialSignatureFields);
    const { token } = useAuthStore();
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageScale, setPageScale] = useState<number>(1);
    const [pagesToRender, setPagesToRender] = useState<number[]>([]);

    const [displayPositions, setDisplayPositions] = useState<Map<string, { x: number; y: number; page: number }>>(new Map());

    const scaleCoordinates = useCallback((x: number, y: number, scale: number) => {
        return {
            x: x * scale,
            y: y * scale,
        };
    }, []);

    const unscaleCoordinates = useCallback((x: number, y: number, scale: number) => {
        return {
            x: Math.round(x / scale),
            y: Math.round(y / scale),
        };
    }, []);

    // --- PERBAIKAN: Gunakan initialSignatureFields sebagai nilai awal dan update hanya jika berubah dari prop ---
    useEffect(() => {
        const uniquePages: Set<number> = new Set();
        const newDisplayPositions = new Map<string, { x: number; y: number; page: number }>();

        let currentSignatureFields = initialSignatureFields;

        if (currentSignatureFields?.length > 0) {
            currentSignatureFields.forEach(field => {
                uniquePages.add(field.page_signature);
                newDisplayPositions.set(field.category, { x: field.pos_x, y: field.pos_y, page: field.page_signature });
            });
        } else {
            uniquePages.add(1); // Default ke halaman 1 jika tidak ada field
        }

        // Hanya set state jika initialSignatureFields benar-benar berbeda dari state lokal saat ini
        if (JSON.stringify(signatureFieldsLocal) !== JSON.stringify(currentSignatureFields)) {
            setSignatureFieldsLocal(currentSignatureFields);
        }

        // Perbarui pagesToRender
        const sortedPages = Array.from(uniquePages).sort((a, b) => a - b);
        setPagesToRender(sortedPages.length > 0 ? sortedPages : [1]);

        // Perbarui displayPositions, tapi hanya jika pageScale sudah tersedia atau jika Map kosong
        // Koordinat yang diskalakan akan dihitung di useEffect berikutnya
        // Penting: hindari setDisplayPositions di sini jika pageScale belum siap
        if (pageScale > 0) {
            const scaledPositions = new Map<string, { x: number; y: number; page: number }>();
            newDisplayPositions.forEach((pos, category) => {
                const scaled = scaleCoordinates(pos.x, pos.y, pageScale);
                scaledPositions.set(category, { x: scaled.x, y: scaled.y, page: pos.page });
            });
            // Hanya update jika ada perbedaan nyata
            if (JSON.stringify(Array.from(displayPositions.entries())) !== JSON.stringify(Array.from(scaledPositions.entries()))) {
                setDisplayPositions(scaledPositions);
            }
        } else {
            // Jika pageScale belum siap, simpan posisi asli dulu, scaling akan dilakukan nanti
            if (JSON.stringify(Array.from(displayPositions.entries())) !== JSON.stringify(Array.from(newDisplayPositions.entries()))) {
                setDisplayPositions(newDisplayPositions);
            }
        }

        // Beri tahu parent component setiap kali initialSignatureFields berubah
        // Ini memastikan state parent selalu sinkron dengan initial state yang masuk
        onSignatureFieldsChange(currentSignatureFields);

    }, [initialSignatureFields, pageScale, onSignatureFieldsChange, scaleCoordinates]); // Tambahkan initialSignatureFields sebagai dependency

    // --- PERBAIKAN: useEffect untuk scaling koordinat tampilan yang lebih defensif ---
    // Efek ini akan berjalan setelah pageScale dihitung atau diperbarui,
    // dan setelah displayPositions diinisialisasi dari initialSignatureFields
    useEffect(() => {
        if (pageScale > 0 && displayPositions.size > 0) {
            const updatedDisplayPositions = new Map<string, { x: number; y: number; page: number }>();
            let changed = false;

            displayPositions.forEach((pos, category) => {
                const scaled = scaleCoordinates(pos.x, pos.y, pageScale);
                const currentDisplayPos = displayPositions.get(category);

                // Periksa apakah posisi yang diskalakan berbeda secara signifikan
                if (!currentDisplayPos ||
                    Math.abs(currentDisplayPos.x - scaled.x) > 0.01 || // Toleransi kecil untuk floating point
                    Math.abs(currentDisplayPos.y - scaled.y) > 0.01 ||
                    currentDisplayPos.page !== pos.page
                ) {
                    updatedDisplayPositions.set(category, { x: scaled.x, y: scaled.y, page: pos.page });
                    changed = true;
                } else {
                    updatedDisplayPositions.set(category, currentDisplayPos); // Pertahankan referensi yang sama
                }
            });

            // Hanya set state jika ada perubahan nyata pada data atau ukuran Map
            if (changed || displayPositions.size !== updatedDisplayPositions.size) {
                setDisplayPositions(updatedDisplayPositions);
            }
        }
    }, [pageScale, scaleCoordinates]); // displayPositions di sini adalah state lama yang akan digunakan untuk membandingkan.

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfLoading(false);
        if (pdfContainerRef.current) {
            const containerWidth = pdfContainerRef.current.offsetWidth;
            if (DEFAULT_PDF_RENDER_WIDTH_PX > 0) {
                const newScale = containerWidth / DEFAULT_PDF_RENDER_WIDTH_PX;
                // Hanya perbarui skala jika ada perubahan yang signifikan
                if (Math.abs(newScale - pageScale) > 0.001) {
                    setPageScale(newScale);
                }
            }
        }
    }, [pageScale]); // Tambahkan pageScale sebagai dependensi

    const onDocumentLoadError = useCallback((error: any) => {
        console.error("Error loading PDF:", error);
        toast.error("Gagal memuat pratinjau PDF.");
        setPdfLoading(false);
    }, []);

    // --- PERBAIKAN: Debounce handleResize ---
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (pdfContainerRef.current && numPages > 0) {
                    const containerWidth = pdfContainerRef.current.offsetWidth;
                    if (DEFAULT_PDF_RENDER_WIDTH_PX > 0) {
                        const newScale = containerWidth / DEFAULT_PDF_RENDER_WIDTH_PX;
                        // Hanya set state jika skala berubah secara signifikan
                        if (Math.abs(newScale - pageScale) > 0.001) {
                            setPageScale(newScale);
                        }
                    }
                }
            }, 100); 
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [numPages, pageScale]); 

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let updatedFields = [...signatureFieldsLocal];
        const newDisplayPositions = new Map(displayPositions);

        const originalCoords = unscaleCoordinates(x, y, pageScale);

        let targetCategory: "Petugas" | "Penerima" | null = null;
        if (!newDisplayPositions.has("Petugas")) {
            targetCategory = "Petugas";
        } else if (!newDisplayPositions.has("Penerima")) {
            targetCategory = "Penerima";
        }

        if (targetCategory) {
            updatedFields = updatedFields.filter((f) => f.category !== targetCategory);
            updatedFields.push({ category: targetCategory, pos_x: originalCoords.x, pos_y: originalCoords.y, page_signature: pageNumber });
            setSignatureFieldsLocal(updatedFields);

            // Perbarui display state dengan koordinat tampilan yang baru
            newDisplayPositions.set(targetCategory, { x, y, page: pageNumber });
            setDisplayPositions(newDisplayPositions);

            onSignatureFieldsChange(updatedFields);
            toast.success(`Posisi ${targetCategory} berhasil ditentukan.`);
        } else {
            toast.warning("Anda sudah menentukan kedua posisi (Petugas dan Penerima).");
        }
    };

    const handleReset = () => {
        setDisplayPositions(new Map());
        setSignatureFieldsLocal([]);
        onSignatureFieldsChange([]);
        setPagesToRender([1]);
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

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Letakkan Tanda Tangan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Klik pada area PDF untuk menentukan posisi tanda tangan:
            </p>

            {/* PDF Viewer */}
            <div
                ref={pdfContainerRef}
                className="relative w-full mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden hover:shadow-lg transition-shadow"
                style={{ maxWidth: '800px' }}
            >
                {pdfLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-30">
                        <LoadingSpinner message="Memuat pratinjau PDF..." size="full" isFullScreen/>
                    </div>
                )}
                {doc.example_file && (
                    <Document
                        file={doc.example_file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading=""
                    >
                        {pagesToRender.map((pageNumber) => (
                            <div
                                key={`page-${pageNumber}`}
                                className="relative cursor-pointer"
                                onClick={(e) => handleClick(e, pageNumber)}
                            >
                                <Page
                                    key={`page-render-${pageNumber}`}
                                    pageNumber={pageNumber}
                                    scale={pageScale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="w-full h-full"
                                />

                                {/* Marker for Petugas - Scaled position for display */}
                                {displayPositions.has("Petugas") && displayPositions.get("Petugas")?.page === pageNumber && (
                                    <div
                                        className="absolute flex items-center space-x-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10"
                                        style={{
                                            left: `${displayPositions.get("Petugas")?.x}px`,
                                            top: `${displayPositions.get("Petugas")?.y}px`
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                        <span>Petugas</span>
                                    </div>
                                )}

                                {/* Marker for Penerima - Scaled position for display */}
                                {displayPositions.has("Penerima") && displayPositions.get("Penerima")?.page === pageNumber && (
                                    <div
                                        className="absolute flex items-center space-x-1 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10"
                                        style={{
                                            left: `${displayPositions.get("Penerima")?.x}px`,
                                            top: `${displayPositions.get("Penerima")?.y}px`
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                        <span>Penerima</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Document>
                )}
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Hanya halaman yang relevan (dengan bidang tanda tangan) yang ditampilkan untuk penempatan, atau halaman 1 jika belum ada.
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={signatureFieldsLocal.length < 2}
                    className={`
            px-5 py-2 rounded-lg font-medium transition-colors
            ${signatureFieldsLocal.length >= 2
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Simpan Posisi
                </button>
                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}