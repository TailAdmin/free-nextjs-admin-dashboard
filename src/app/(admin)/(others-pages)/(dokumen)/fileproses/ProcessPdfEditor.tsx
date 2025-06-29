// src/components/documents/ProcessPdfEditor.tsx
"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useAuthStore } from "@/lib/stores/useAuthStore"; // Asumsi useAuthStore ada
import {
    DocTemplateResponse,
    SignatureField,
    ProcessPdfEditorProps,
} from "@/types/pdfTemplate.types";
import { updateDocWithSignatures } from "@/lib/services/pdfTemplateService"; // Asumsi updateDocWithSignatures ada
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner"; // Asumsi LoadingSpinner ada

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const DEFAULT_PDF_RENDER_WIDTH_PX = 794; // Ukuran lebar default render PDF (sesuai lebar asli halaman A4)

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

    // displayPositions akan menyimpan koordinat yang SUDAH DISKALAKAN untuk ditampilkan di UI
    const [displayPositions, setDisplayPositions] = useState<Map<string, { x: number; y: number; page: number }>>(new Map());

    // --- Logging untuk debugging ---
    useEffect(() => {
        console.log("ProcessPdfEditor (Mounted/Updated):");
        console.log("  doc.example_file:", doc.example_file);
        console.log("  pdfLoading:", pdfLoading);
        console.log("  numPages:", numPages);
        console.log("  currentPage:", currentPage);
        console.log("  signatureFieldsLocal:", signatureFieldsLocal);
        console.log("  displayPositions:", Array.from(displayPositions.entries()));
        console.log("  initialSignatureFields:", initialSignatureFields);
    }, [doc.example_file, pdfLoading, numPages, currentPage, signatureFieldsLocal, displayPositions, initialSignatureFields]);

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

    // Efek untuk menginisialisasi signatureFieldsLocal dan displayPositions dari initialSignatureFields
    useEffect(() => {
        // Periksa apakah initialSignatureFields dari parent berbeda dari state lokal
        // Deep comparison diperlukan untuk array objek
        if (JSON.stringify(initialSignatureFields) !== JSON.stringify(signatureFieldsLocal)) {
            console.log("ProcessPdfEditor: Initializing signatureFieldsLocal from initialSignatureFields.");
            setSignatureFieldsLocal(initialSignatureFields);

            // Langsung perbarui displayPositions berdasarkan initialSignatureFields
            const initialDisplayMap = new Map<string, { x: number; y: number; page: number }>();
            initialSignatureFields.forEach(field => {
                // Simpan koordinat mentah dulu, penskalaan akan ditangani di useEffect terpisah
                initialDisplayMap.set(field.category, { x: field.pos_x, y: field.pos_y, page: field.page_signature });
            });
            setDisplayPositions(initialDisplayMap);
        }
        // onSignatureFieldsChange sebaiknya hanya dipanggil saat signatureFieldsLocal berubah
        // karena ini adalah state yang dimanipulasi oleh editor.
        // Panggilan ini dipindahkan ke handleClick, handleReset, atau saat handleSubmit berhasil.
    }, [initialSignatureFields]); // Hanya bergantung pada initialSignatureFields

    // Efek untuk menangani scaling koordinat tampilan ketika pageScale atau signatureFieldsLocal berubah
    useEffect(() => {
        // Jalankan efek ini hanya jika ada halaman yang dimuat dan skala lebih dari 0
        if (pageScale > 0 && numPages > 0) {
            const updatedDisplayPositions = new Map<string, { x: number; y: number; page: number }>();
            let changed = false;

            signatureFieldsLocal.forEach(field => {
                const scaled = scaleCoordinates(field.pos_x, field.pos_y, pageScale);
                const currentDisplayPos = displayPositions.get(field.category);

                if (!currentDisplayPos ||
                    Math.abs(currentDisplayPos.x - scaled.x) > 0.01 ||
                    Math.abs(currentDisplayPos.y - scaled.y) > 0.01 ||
                    currentDisplayPos.page !== field.page_signature
                ) {
                    updatedDisplayPositions.set(field.category, { x: scaled.x, y: scaled.y, page: field.page_signature });
                    changed = true;
                } else {
                    updatedDisplayPositions.set(field.category, currentDisplayPos);
                }
            });

            if (changed || displayPositions.size !== updatedDisplayPositions.size) {
                setDisplayPositions(updatedDisplayPositions);
                console.log("ProcessPdfEditor: Rescaled display positions due to pageScale or signatureFieldsLocal change.");
            }
        } else if (signatureFieldsLocal.length === 0 && displayPositions.size > 0) {
            // Jika tidak ada signature fields dan displayPositions tidak kosong, kosongkan
            setDisplayPositions(new Map());
        }
    }, [pageScale, signatureFieldsLocal, scaleCoordinates, numPages]); // Dependensi yang lebih tepat // signatureFieldsLocal ditambahkan untuk memastikan efek hanya berjalan ketika initialFields berubah relatif terhadap state lokal


    // Efek untuk menangani scaling koordinat tampilan ketika pageScale berubah
    useEffect(() => {
        // Jalankan efek ini hanya jika ada halaman yang dimuat dan skala lebih dari 0
        if (pageScale > 0 && numPages > 0) {
            const updatedDisplayPositions = new Map<string, { x: number; y: number; page: number }>();
            let changed = false;

            signatureFieldsLocal.forEach(field => {
                const scaled = scaleCoordinates(field.pos_x, field.pos_y, pageScale);
                const currentDisplayPos = displayPositions.get(field.category);

                // Periksa perubahan signifikan pada posisi atau halaman
                if (!currentDisplayPos ||
                    Math.abs(currentDisplayPos.x - scaled.x) > 0.01 ||
                    Math.abs(currentDisplayPos.y - scaled.y) > 0.01 ||
                    currentDisplayPos.page !== field.page_signature
                ) {
                    updatedDisplayPositions.set(field.category, { x: scaled.x, y: scaled.y, page: field.page_signature });
                    changed = true;
                } else {
                    updatedDisplayPositions.set(field.category, currentDisplayPos);
                }
            });

            // Hanya perbarui state jika ada perubahan atau jumlah item berbeda
            if (changed || displayPositions.size !== updatedDisplayPositions.size) {
                setDisplayPositions(updatedDisplayPositions);
                console.log("ProcessPdfEditor: Rescaled display positions due to pageScale change.");
            }
        } else if (signatureFieldsLocal.length === 0 && displayPositions.size > 0) {
            // Jika tidak ada signature fields dan displayPositions tidak kosong, kosongkan
            setDisplayPositions(new Map());
        }
    }, [pageScale, signatureFieldsLocal, scaleCoordinates, numPages]);


    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        console.log("ProcessPdfEditor: PDF loaded successfully. Number of pages:", numPages);
        setNumPages(numPages);
        setPdfLoading(false);
        setCurrentPage(1); // Selalu kembali ke halaman 1 saat dokumen baru dimuat

        // Atur skala awal berdasarkan lebar container
        if (pdfContainerRef.current) {
            const containerWidth = pdfContainerRef.current.offsetWidth;
            if (DEFAULT_PDF_RENDER_WIDTH_PX > 0) {
                const newScale = containerWidth / DEFAULT_PDF_RENDER_WIDTH_PX;
                if (Math.abs(newScale - pageScale) > 0.001) { // Periksa perubahan signifikan
                    setPageScale(newScale);
                }
            }
        }
    }, [pageScale]);


    const onDocumentLoadError = useCallback((error: any) => {
        console.error("ProcessPdfEditor: Error loading PDF:", error);
        toast.error("Gagal memuat pratinjau PDF.");
        setPdfLoading(false);
        setNumPages(0);
        setCurrentPage(1);
    }, []);

    // Efek untuk mengatur ukuran ulang PDF saat container berubah
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (pdfContainerRef.current && numPages > 0) { // Hanya sesuaikan jika numPages sudah diketahui
                    const containerWidth = pdfContainerRef.current.offsetWidth;
                    if (DEFAULT_PDF_RENDER_WIDTH_PX > 0) {
                        const newScale = containerWidth / DEFAULT_PDF_RENDER_WIDTH_PX;
                        if (Math.abs(newScale - pageScale) > 0.001) {
                            setPageScale(newScale);
                        }
                    }
                }
            }, 100); // Debounce resize event
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil handleResize segera setelah komponen dimuat
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [numPages, pageScale]);


    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let updatedFields = [...signatureFieldsLocal];
        const newDisplayPositions = new Map(displayPositions); // Salin map state saat ini

        const originalCoords = unscaleCoordinates(x, y, pageScale);

        let targetCategory: "Petugas" | "Penerima" | null = null;
        if (!updatedFields.some(f => f.category === "Petugas")) {
            targetCategory = "Petugas";
        } else if (!updatedFields.some(f => f.category === "Penerima")) {
            targetCategory = "Penerima";
        }

        if (targetCategory) {
            updatedFields = updatedFields.filter((f) => f.category !== targetCategory); // Hapus yang lama jika ada
            updatedFields.push({ category: targetCategory, pos_x: originalCoords.x, pos_y: originalCoords.y, page_signature: currentPage });

            setSignatureFieldsLocal(updatedFields);
            onSignatureFieldsChange(updatedFields); // Beri tahu parent component

            newDisplayPositions.set(targetCategory, { x, y, page: currentPage });
            setDisplayPositions(newDisplayPositions); // Update state displayPositions
            console.log(`ProcessPdfEditor: Posisi ${targetCategory} di halaman ${currentPage} diatur.`);

            toast.success(`Posisi ${targetCategory} berhasil ditentukan pada halaman ${currentPage}.`);
        } else {
            toast.warning("Anda sudah menentukan kedua posisi (Petugas dan Penerima). Silakan gunakan tombol Reset untuk mengatur ulang.");
        }
    };

    const handleReset = () => {
        setDisplayPositions(new Map()); // Reset tampilan marker
        setSignatureFieldsLocal([]); // Reset data marker lokal
        onSignatureFieldsChange([]); // Beri tahu parent untuk reset juga
        setCurrentPage(1); // Kembali ke halaman 1 saat reset
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
            console.log("ProcessPdfEditor: Mengirim data tanda tangan ke server:", signatureFieldsLocal);
            await updateDocWithSignatures(doc.id.toString(), signatureFieldsLocal, token);
            toast.success("Tanda tangan berhasil disimpan.");
            if (onSaveSuccess) {
                onSaveSuccess(); // Panggil callback dari parent untuk memuat ulang data
            }
        } catch (error) {
            console.error("Gagal menyimpan posisi tanda tangan:", error);
            toast.error("Gagal menyimpan posisi tanda tangan.");
        }
    };

    // Fungsi untuk navigasi halaman
    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(numPages, prevPage + 1));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Letakkan Tanda Tangan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Klik pada area PDF untuk menentukan posisi tanda tangan. Navigasi halaman menggunakan tombol di bawah.
            </p>

            {/* PDF Viewer */}
            <div
                ref={pdfContainerRef}
                className="relative w-full mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden hover:shadow-lg transition-shadow"
                style={{ maxWidth: '800px' }}
            >
                {/* Loader Overlay */}
                {pdfLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-30">
                        <LoadingSpinner message="Memuat pratinjau PDF..." size="full" isFullScreen={false} />
                    </div>
                )}
                {/* Render Document only if doc.example_file exists */}
                {doc.example_file ? (
                    <Document
                        file={doc.example_file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading="" // Kosongkan loading prop agar kita mengelola loader sendiri
                    >
                        <div
                            className="relative cursor-pointer"
                            onClick={handleClick}
                        >
                            <Page
                                key={`page-render-${currentPage}`}
                                pageNumber={currentPage}
                                scale={pageScale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="w-full h-full"
                            />

                            {/* Marker for Petugas - Hanya tampilkan jika di currentPage dan ada di displayPositions */}
                            {displayPositions.has("Petugas") && displayPositions.get("Petugas")?.page === currentPage && (
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

                            {/* Marker for Penerima - Hanya tampilkan jika di currentPage dan ada di displayPositions */}
                            {displayPositions.has("Penerima") && displayPositions.get("Penerima")?.page === currentPage && (
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
                    </Document>
                ) : (
                    // Tampilkan pesan "Tidak ada file PDF" hanya jika tidak sedang loading
                    !pdfLoading && (
                        <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
                            Tidak ada file PDF untuk ditampilkan.
                        </div>
                    )
                )}
            </div>

            {/* Navigasi Halaman */}
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
                    className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}