"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFDocument, rgb } from "pdf-lib"; // Import rgb
import { useAuthStore } from "@/lib/stores/useAuthStore";
import {
    GetSessionDetailsResponse,
    SignatureField,
} from "@/types/signatureProcess.types";
import { fetchDocById } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";
import Image from "next/image";
import CustomSignaturePad from "@/components/canvas/SignaturePad";
import { getSessionDetails, getSignatureImage } from "@/lib/services/signatureProcessService";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// === KONFIGURASI BARU UNTUK STABILITAS MARKER ===
// Lebar A4 dalam poin PDF (1 inci = 72 poin)
const A4_WIDTH_POINTS = 595.28;
const A4_HEIGHT_POINTS = 841.89;

// Lebar render default yang Anda gunakan untuk perhitungan awal atau asumsi DPI
// Jika ProcessPdfEditor menyimpan pos_x/pos_y berdasarkan lebar 794px, kita gunakan ini sebagai referensi.
const DEFAULT_PIXEL_RENDER_WIDTH = 794; // Lebar piksel saat posisi awal ditentukan di ProcessPdfEditor

// Rasio konversi dari piksel di DEFAULT_PIXEL_RENDER_WIDTH ke poin PDF A4
// Ini adalah faktor untuk mengonversi pos_x/pos_y yang disimpan (dalam piksel)
// menjadi poin PDF yang sebenarnya.
const PIXEL_TO_A4_POINT_RATIO = A4_WIDTH_POINTS / DEFAULT_PIXEL_RENDER_WIDTH; // sekitar 0.75

// Konfigurasi ukuran tanda tangan
const SIGNATURE_CONFIG = {
    // Ukuran default tanda tangan dalam poin PDF
    DEFAULT_WIDTH_PDF_POINTS: 80, // Misalnya, lebar tanda tangan 80 poin
    DEFAULT_HEIGHT_PDF_POINTS: 40, // Misalnya, tinggi tanda tangan 40 poin
    SCALE_FACTOR: 0.8, // Faktor skala untuk tanda tangan (misal: 0.8 dari ukuran default)
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export default function ClientSignPage() {
    const pathname = usePathname();
    const router = useRouter();
    const sessionId = pathname.split("/").pop();
    const { token } = useAuthStore();

    // State data
    const [sessionDetails, setSessionDetails] = useState<GetSessionDetailsResponse | null>(null);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [staffSignatureDataUrl, setStaffSignatureDataUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [renderedPagesCount, setRenderedPagesCount] = useState(0);
    const [isPdfLoaded, setIsPdfLoaded] = useState(false);

    // Scale PDF
    const [pageScale, setPageScale] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    const REACT_PDF_INTERNAL_RENDER_WIDTH = 794;

    const pdfContainerRef = useRef<HTMLDivElement>(null);

    // Load session & document
    useEffect(() => {
        const loadSessionAndDoc = async () => {
            setError(null);
            setLoading(true);
            if (!sessionId || !token) {
                setError("Sesi ID atau token tidak tersedia.");
                setLoading(false);
                return;
            }

            try {
                const fetchedSessionData = await getSessionDetails(sessionId);
                setSessionDetails(fetchedSessionData);

                const templateId = fetchedSessionData.metadata?.data?.template_id;
                if (!templateId) throw new Error("Template ID tidak ditemukan.");

                const docData: DocTemplateResponse = await fetchDocById(templateId, token);
                setDocumentUrl(docData.example_file);

                const primarySignatureId = fetchedSessionData.metadata?.data?.primary_signature;
                if (primarySignatureId && token) {
                    const staffSig = await getSignatureImage(primarySignatureId, token);
                    setStaffSignatureDataUrl(staffSig);
                }
            } catch (err: any) {
                console.error("Error loading session or document:", err);
                setError(err.message || "Gagal memuat sesi atau dokumen.");
            } finally {
                setLoading(false);
            }
        };

        loadSessionAndDoc();
    }, [sessionId, token]);

    // Reset state saat PDF berubah
    useEffect(() => {
        setIsPdfLoaded(false);
        setRenderedPagesCount(0);
        // Reset skala juga ketika dokumen baru dimuat
        setPageScale(1);
    }, [documentUrl]);

    // Handle resize untuk menentukan pageScale tampilan
    useEffect(() => {
        const handleResize = () => {
            if (pdfContainerRef.current) {
                const containerWidth = pdfContainerRef.current.offsetWidth;
                // Skala dihitung berdasarkan lebar container dibagi lebar render internal react-pdf
                // Ini akan menjaga PDF terisi penuh dalam container dan menyesuaikan marker.
                setPageScale(containerWidth / REACT_PDF_INTERNAL_RENDER_WIDTH);
            }
        };
        // Panggil sekali saat komponen dimuat
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [documentUrl]); // Tambahkan documentUrl sebagai dependensi

    // Callback ketika PDF berhasil dimuat
    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setRenderedPagesCount(0);
    }, []);

    // Callback setelah halaman selesai dirender
    const handlePageRenderSuccess = useCallback(() => {
        setRenderedPagesCount((prev) => {
            const next = prev + 1;
            if (next === numPages) {
                setIsPdfLoaded(true);
            }
            return next;
        });
    }, [numPages]);

    // Simpan tanda tangan
    const handleSignatureSave = (dataUrl: string) => {
        setSignatureDataUrl(dataUrl);
        toast.success("Tanda tangan berhasil dibuat!");
        setSignedPdfBlob(null);
    };

    // Proses PDF
    const handleProcessPdf = useCallback(async () => {
        if (!documentUrl || !signatureDataUrl || !sessionDetails) {
            toast.error("Data tidak lengkap untuk memproses PDF.");
            return;
        }
        setIsSubmitting(true);
        setSignedPdfBlob(null);

        try {
            const originalPdfBytes = await (await fetch(documentUrl)).arrayBuffer();
            const pdfDoc = await PDFDocument.load(originalPdfBytes);

            const clientSignatureImage = await pdfDoc.embedPng(signatureDataUrl);
            let staffSignatureEmbeddedImage = null;

            // Dapatkan dimensi gambar tanda tangan klien yang disesuaikan
            const clientDims = clientSignatureImage.scale(SIGNATURE_CONFIG.SCALE_FACTOR);

            // Dapatkan dimensi gambar tanda tangan petugas (jika ada)
            let staffDims = { width: 0, height: 0 };
            if (staffSignatureDataUrl) {
                staffSignatureEmbeddedImage = await pdfDoc.embedPng(staffSignatureDataUrl);
                staffDims = staffSignatureEmbeddedImage.scale(SIGNATURE_CONFIG.SCALE_FACTOR);
            }

            const fields = sessionDetails.metadata?.data?.signature_fields || [];

            for (const field of fields) {
                const pageIndex = (field.page_signature || 1) - 1; // Default ke halaman 1 jika undefined
                if (pageIndex < 0 || pageIndex >= pdfDoc.getPages().length) {
                    console.warn(`Halaman ${field.page_signature} tidak valid. Melompati tanda tangan.`);
                    continue;
                }

                const page = pdfDoc.getPages()[pageIndex];
                const { width: pageWidth, height: pageHeight } = page.getSize();

                let imageToDraw, dimsToUse;
                if (field.category === "Penerima") {
                    imageToDraw = clientSignatureImage;
                    dimsToUse = clientDims;
                } else if (field.category === "Petugas" && staffSignatureEmbeddedImage) {
                    imageToDraw = staffSignatureEmbeddedImage;
                    dimsToUse = staffDims;
                } else {
                    continue; // Lewati jika tidak ada gambar atau kategori tidak dikenal
                }

                // === PERBAIKAN PENTING UNTUK STABILITAS MARKER ===
                // Konversi pos_x dan pos_y dari piksel referensi (794px) ke poin PDF
                // Asumsi: pos_x dan pos_y disimpan berdasarkan lebar DEFAULT_PIXEL_RENDER_WIDTH (794px)
                const x_pdf_points = field.pos_x * PIXEL_TO_A4_POINT_RATIO;
                // Y-axis di PDF-lib dimulai dari bawah. pos_y dari atas.
                // Jadi, kita harus mengubahnya: pageHeight - (pos_y dikonversi + tinggi gambar).
                const y_pdf_points = pageHeight - (field.pos_y * PIXEL_TO_A4_POINT_RATIO) - dimsToUse.height;

                // Tambahkan validasi koordinat untuk mencegah gambar keluar batas
                if (
                    x_pdf_points < 0 || y_pdf_points < 0 ||
                    x_pdf_points + dimsToUse.width > pageWidth ||
                    y_pdf_points + dimsToUse.height > pageHeight
                ) {
                    console.warn(`Posisi tanda tangan ${field.category} (${field.pos_x}, ${field.pos_y}) di halaman ${field.page_signature} berada di luar batas halaman PDF A4. Melompati.`);
                    // Opsional: Anda bisa menyesuaikan posisi agar tetap di dalam halaman
                    // x_pdf_points = Math.max(0, Math.min(x_pdf_points, pageWidth - dimsToUse.width));
                    // y_pdf_points = Math.max(0, Math.min(y_pdf_points, pageHeight - dimsToUse.height));
                    continue; // Lewati jika di luar batas
                }


                page.drawImage(imageToDraw, {
                    x: x_pdf_points,
                    y: y_pdf_points,
                    width: dimsToUse.width,
                    height: dimsToUse.height,
                });
            }

            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
            setSignedPdfBlob(blob);
            toast.success("PDF berhasil diproses! Siap dikirim.");
        } catch (err: any) {
            console.error("Gagal memproses PDF:", err);
            toast.error(`Gagal memproses PDF: ${err.message || "Terjadi kesalahan."}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        documentUrl,
        signatureDataUrl,
        staffSignatureDataUrl,
        sessionDetails,
    ]);

    // Kirim PDF ke API
    const handleSubmitSignedPdfToApi = useCallback(async () => {
        if (!signedPdfBlob || !sessionId || !token) {
            toast.error("Data tidak lengkap untuk mengirim dokumen.");
            return;
        }
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append(
                "temp_file",
                signedPdfBlob,
                `signed_document_${sessionId}.pdf`
            );
            formData.append("session_id", sessionId);
            formData.append("session_stage", "confirm");

            const res = await fetch(`${API_URL}/signatures/process/start/temp-file/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal mengirim dokumen.");
            }

            const result = await res.json();
            toast.success("Dokumen berhasil dikirim!");
        } catch (err: any) {
            console.error("Error submitting signed PDF:", err);
            toast.error(`Gagal mengirim dokumen: ${err.message || "Terjadi kesalahan."}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [signedPdfBlob, sessionId, token, router]);

    // Filter signature fields yang relevan dengan halaman saat ini
    const currentSignatureFields =
        sessionDetails?.metadata?.data?.signature_fields?.filter(
            (field) => (field.page_signature || 1) === currentPageNumber // Default ke halaman 1 jika page_signature undefined
        ) || [];

    const staffSignatureField = currentSignatureFields.find(
        (f) => f.category === "Petugas"
    );
    const clientSignatureField = currentSignatureFields.find(
        (f) => f.category === "Penerima"
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat sesi tanda tangan...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!sessionDetails || !documentUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Sesi atau dokumen tidak valid.
            </div>
        );
    }

    return (
        <>
            {/* Fullscreen Loading Spinner */}
            {!isPdfLoaded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
                    <LoadingSpinner size="full" message="Memuat dokumen PDF..." isFullScreen />
                </div>
            )}

            {/* Konten utama hanya muncul setelah PDF selesai dirender */}
            <div className={`flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 ${isPdfLoaded ? '' : 'hidden'}`}>
                <div className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                        Dokumen untuk ditandatangani
                    </h2>
                    <div
                        ref={pdfContainerRef}
                        className="relative w-full max-w-[800px] mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700"
                    >
                        <Document
                            file={documentUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={(error) =>
                                console.error("Error loading PDF:", error)
                            }
                            loading="" // Suppress default loading message
                        >
                            {Array.from({ length: numPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <div key={`page_wrapper_${pageNumber}`} className="relative">
                                        <Page
                                            key={`page_${pageNumber}`}
                                            pageNumber={pageNumber}
                                            scale={pageScale}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            onRenderSuccess={handlePageRenderSuccess}
                                        // onRenderError={handlePageRenderError} // Opsional: tambahkan penanganan error render
                                        />

                                        {/* Overlay tanda tangan petugas */}
                                        {staffSignatureDataUrl && staffSignatureField && staffSignatureField.page_signature === pageNumber && (
                                            <Image
                                                src={staffSignatureDataUrl}
                                                alt="Tanda Tangan Petugas"
                                                width={SIGNATURE_CONFIG.DEFAULT_WIDTH_PDF_POINTS * pageScale}
                                                height={SIGNATURE_CONFIG.DEFAULT_HEIGHT_PDF_POINTS * pageScale}
                                                priority
                                                className="absolute z-20"
                                                style={{
                                                    // Posisi X dihitung dari kiri atas
                                                    left: `${staffSignatureField.pos_x * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                    // Posisi Y dihitung dari atas ke bawah
                                                    top: `${staffSignatureField.pos_y * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                    // Tetapkan ukuran overlay secara eksplisit dalam piksel tampilan
                                                    width: `${SIGNATURE_CONFIG.DEFAULT_WIDTH_PDF_POINTS * pageScale}px`,
                                                    height: `${SIGNATURE_CONFIG.DEFAULT_HEIGHT_PDF_POINTS * pageScale}px`,
                                                }}
                                            />
                                        )}

                                        {/* Overlay tanda tangan klien */}
                                        {signatureDataUrl && clientSignatureField && clientSignatureField.page_signature === pageNumber && (
                                            <Image
                                                src={signatureDataUrl}
                                                alt="Tanda Tangan Klien"
                                                width={SIGNATURE_CONFIG.DEFAULT_WIDTH_PDF_POINTS * pageScale}
                                                height={SIGNATURE_CONFIG.DEFAULT_HEIGHT_PDF_POINTS * pageScale}
                                                priority
                                                className="absolute z-20"
                                                style={{
                                                    // Posisi X dihitung dari kiri atas
                                                    left: `${clientSignatureField.pos_x * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                    // Posisi Y dihitung dari atas ke bawah
                                                    top: `${clientSignatureField.pos_y * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                    // Tetapkan ukuran overlay secara eksplisit dalam piksel tampilan
                                                    width: `${SIGNATURE_CONFIG.DEFAULT_WIDTH_PDF_POINTS * pageScale}px`,
                                                    height: `${SIGNATURE_CONFIG.DEFAULT_HEIGHT_PDF_POINTS * pageScale}px`,
                                                }}
                                            />
                                        )}

                                        {/* Mark posisi tanda tangan yang belum ditandatangani */}
                                        {currentSignatureFields
                                            .filter(
                                                (field) =>
                                                    (field.page_signature || 1) === pageNumber &&
                                                    !((field.category === "Petugas" && staffSignatureDataUrl) ||
                                                        (field.category === "Penerima" && signatureDataUrl))
                                            )
                                            .map((field, fieldIndex) => {
                                                const style = {
                                                    // Konversi posisi x dari piksel referensi ke piksel tampilan
                                                    left: `${field.pos_x * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                    // Konversi posisi y dari piksel referensi ke piksel tampilan
                                                    top: `${field.pos_y * pageScale * (REACT_PDF_INTERNAL_RENDER_WIDTH / DEFAULT_PIXEL_RENDER_WIDTH)}px`,
                                                };

                                                return (
                                                    <div
                                                        key={`${field.category}-${fieldIndex}-page-${pageNumber}`}
                                                        className={`absolute rounded px-2 py-1 text-xs font-semibold shadow-md z-10 opacity-70
                                                            ${field.category === "Petugas" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}
                                                        `}
                                                        style={style}
                                                    >
                                                        {field.category} (Butuh Tanda Tangan)
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            })}
                        </Document>
                    </div>

                    {/* Navigasi halaman */}
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                        Menampilkan halaman {currentPageNumber} dari {numPages || 1}.
                    </div>
                    {numPages > 1 && (
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() =>
                                    setCurrentPageNumber((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPageNumber === 1}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPageNumber((p) => Math.min(numPages, p + 1))
                                }
                                disabled={currentPageNumber === numPages}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar signature pad */}
                <div className="w-full lg:w-96 dark:bg-gray-800 shadow p-6 flex flex-col gap-4 overflow-y-auto">
                    <CustomSignaturePad onSave={handleSignatureSave} />
                    <button
                        onClick={handleProcessPdf}
                        disabled={isSubmitting || !signatureDataUrl || !clientSignatureField}
                        className={`mt-4 px-4 py-2 rounded-md transition-colors ${isSubmitting || !signatureDataUrl || !clientSignatureField
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {isSubmitting && !signedPdfBlob
                            ? "Memproses PDF..."
                            : "Siapkan Dokumen untuk Pengiriman"}
                    </button>
                    {signedPdfBlob && (
                        <button
                            onClick={handleSubmitSignedPdfToApi}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors"
                        >
                            {isSubmitting ? "Mengirim Dokumen..." : "Kirim Dokumen"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}