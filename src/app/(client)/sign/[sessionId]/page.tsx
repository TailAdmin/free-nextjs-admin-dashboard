'use client'
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { PDFDocument, rgb } from 'pdf-lib';
import CustomSignaturePad from '@/components/canvas/SignaturePad';

interface SignatureField {
    category: 'Petugas' | 'Penerima';
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

interface PdfPageRendererProps {
    pageNum: number;
    pdfBytes: Uint8Array | null;
    petugasSignatureImageUrl: string | null;
    penerimaSignatureDataUrl: string | null;
    signatureFieldsJson: string | undefined;
    pdfDocProxy: PDFDocumentProxy | null;
    containerRef?: React.RefObject<HTMLDivElement>; // Container reference for responsive sizing
}

const PdfPageRenderer: React.FC<PdfPageRendererProps> = ({
    pageNum,
    pdfBytes,
    petugasSignatureImageUrl,
    penerimaSignatureDataUrl,
    signatureFieldsJson,
    pdfDocProxy,
    containerRef,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pageRenderedWidth, setPageRenderedWidth] = useState<number | null>(null);
    const [pageRenderedHeight, setPageRenderedHeight] = useState<number | null>(null);
    const [originalPageViewport, setOriginalPageViewport] = useState<pdfjs.PageViewport | null>(null);
    
    // Calculate responsive scale based on container width
    const calculateScale = useCallback(() => {
        if (!containerRef?.current || !originalPageViewport) return 1;
        
        const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
        const maxWidth = Math.min(containerWidth, 800); // Max width cap
        return maxWidth / originalPageViewport.width;
    }, [containerRef, originalPageViewport]);

    // Render PDF page with responsive scaling
    useEffect(() => {
        const renderPage = async () => {
            if (!canvasRef.current || !pdfBytes || !pdfDocProxy) return;

            try {
                const page = await pdfDocProxy.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1 });
                setOriginalPageViewport(viewport);

                // Calculate responsive scale
                const scale = containerRef?.current 
                    ? Math.min((containerRef.current.offsetWidth - 40) / viewport.width, 800 / viewport.width)
                    : 1;
                
                const scaledViewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                setPageRenderedWidth(canvas.width);
                setPageRenderedHeight(canvas.height);

                await page.render({
                    canvasContext: context,
                    viewport: scaledViewport,
                }).promise;
            } catch (error) {
                console.error('Error rendering PDF page:', error);
            }
        };

        renderPage();
    }, [pdfBytes, pageNum, pdfDocProxy, containerRef]);

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current || !pdfBytes || !pdfDocProxy || !originalPageViewport) return;
            
            // Recalculate and re-render on resize
            const renderPage = async () => {
                try {
                    const page = await pdfDocProxy.getPage(pageNum);
                    const scale = containerRef?.current 
                        ? Math.min((containerRef.current.offsetWidth - 40) / originalPageViewport.width, 800 / originalPageViewport.width)
                        : 1;
                    
                    const scaledViewport = page.getViewport({ scale });
                    const canvas = canvasRef.current!;
                    const context = canvas.getContext('2d')!;

                    canvas.height = scaledViewport.height;
                    canvas.width = scaledViewport.width;

                    setPageRenderedWidth(canvas.width);
                    setPageRenderedHeight(canvas.height);

                    await page.render({
                        canvasContext: context,
                        viewport: scaledViewport,
                    }).promise;
                } catch (error) {
                    console.error('Error re-rendering PDF page:', error);
                }
            };

            renderPage();
        };

        const debouncedResize = debounce(handleResize, 150);
        window.addEventListener('resize', debouncedResize);
        
        return () => window.removeEventListener('resize', debouncedResize);
    }, [pdfBytes, pageNum, pdfDocProxy, originalPageViewport, containerRef]);

    // Calculate signature overlay positions relative to current scale
    const getResponsiveOverlayStyle = useCallback((
        category: 'Petugas' | 'Penerima',
        field: SignatureField,
        canvasWidth: number,
        canvasHeight: number,
        originalViewport: pdfjs.PageViewport | null
    ): React.CSSProperties => {
        if (!originalViewport || !canvasWidth || !canvasHeight) {
            return { display: 'none' };
        }

        // Convert absolute PDF coordinates to relative percentages
        const relativeX = field.pos_x / originalViewport.width;
        const relativeY = field.pos_y / originalViewport.height;

        // Calculate display positions based on current canvas size
        const displayX = relativeX * canvasWidth;
        const displayY = relativeY * canvasHeight;

        // Signature dimensions (adjustable based on scale)
        const currentScale = canvasWidth / originalViewport.width;
        const signatureWidth = 100 * currentScale; // Base width 100 PDF points
        const signatureHeight = 50 * currentScale; // Base height 50 PDF points

        return {
            position: 'absolute',
            left: `${displayX}px`,
            top: `${displayY}px`,
            width: `${signatureWidth}px`,
            height: `${signatureHeight}px`,
            zIndex: 10,
            border: `2px dashed ${category === 'Petugas' ? '#3b82f6' : '#10b981'}`,
            borderRadius: '4px',
            backgroundImage: `url(${
                category === 'Petugas' ? petugasSignatureImageUrl : penerimaSignatureDataUrl
            })`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
        };
    }, [petugasSignatureImageUrl, penerimaSignatureDataUrl]);

    // Render signature overlays
    const renderSignatureOverlays = useCallback(() => {
        if (!signatureFieldsJson || !originalPageViewport || !pageRenderedWidth || !pageRenderedHeight) {
            return null;
        }

        try {
            const fields: SignatureField[] = JSON.parse(signatureFieldsJson);
            const pageFields = fields.filter(field => field.page_signature === pageNum);

            return pageFields.map((field) => {
                const hasSignature = field.category === 'Petugas' 
                    ? petugasSignatureImageUrl 
                    : penerimaSignatureDataUrl;

                if (!hasSignature) return null;

                const style = getResponsiveOverlayStyle(
                    field.category,
                    field,
                    pageRenderedWidth,
                    pageRenderedHeight,
                    originalPageViewport
                );

                return (
                    <div
                        key={`${field.category}-${field.page_signature}`}
                        style={style}
                        className="signature-overlay"
                        title={`Tanda tangan ${field.category}`}
                    >
                        {/* Optional: Add category label */}
                        <div 
                            className={`absolute -top-6 left-0 text-xs px-2 py-1 rounded text-white font-medium ${
                                field.category === 'Petugas' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                        >
                            {field.category}
                        </div>
                    </div>
                );
            });
        } catch (error) {
            console.error('Error parsing signature fields:', error);
            return null;
        }
    }, [
        signatureFieldsJson,
        originalPageViewport,
        pageRenderedWidth,
        pageRenderedHeight,
        pageNum,
        getResponsiveOverlayStyle,
    ]);

    return (
        <div className="relative mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700 overflow-hidden">
            <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto block" 
                style={{ display: 'block' }}
            />
            {renderSignatureOverlays()}
        </div>
    );
};

// Utility function for debouncing
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



// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// --- Definisi Tipe Data yang Disesuaikan ---
interface SignatureField {
    category: 'Petugas' | 'Penerima';
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

interface SignatureApiResponse {
    session_id: string;
    status: string; // Status utama dari /start/{session_id}
    metadata: {
        status: string; // Status dari metadata (ini bisa berbeda, hati-hati!)
        data: {
            signature_fields: string; // Ini string JSON yang perlu di-parse
            signee_name: string;
            template_id: string;
            temp_file: string | null;
            primary_signature: string;
            'created-by': {
                id: number;
                username: string;
            };
        };
        'signature-preview-metadata': {
            file_id: string;
            access_url: string;
            expires_in: number;
            starttime: string;
            endtime: string;
            message: string;
        };
    };
}

// Tambahan: Interface untuk respons dari /signatures/process/status
interface StatusResponseObject {
    status: string;
    timestamp: string;
    payload: Record<string, any>; // Bisa kosong atau berisi data tambahan
}
// --- Akhir Definisi Tipe Data ---

interface PdfPageRendererProps {
    pageNum: number;
    pdfBytes: Uint8Array | null;
    petugasSignatureImageUrl: string | null;
    penerimaSignatureDataUrl: string | null;
    signatureFieldsJson: string | undefined;
    pdfDocProxy: PDFDocumentProxy | null;
    pageWidth: number | null; // Tambahkan prop untuk lebar halaman yang dirender
}


const SignSessionPage: React.FC = () => {
    const params = useParams();
    const sessionId = params.sessionId as string;
    const { token, user } = useAuthStore();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [signatureData, setSignatureData] = useState<SignatureApiResponse | null>(null);
    const [petugasSignatureImageUrl, setPetugasSignatureImageUrl] = useState<string | null>(null);
    const [penerimaSignatureDataUrl, setPenerimaSignatureDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSigning, setIsSigning] = useState<boolean>(false); // Mengindikasikan apakah penerima sedang menandatangani
    const [error, setError] = useState<string | null>(null);
    const [modifiedPdfBytes, setModifiedPdfBytes] = useState<Uint8Array | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [isPdfLoaded, setIsPdfLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false); // New state for status check loading

    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const [pageScale, setPageScale] = useState(1);
    const [clientSignatureField, setClientSignatureField] = useState<SignatureField | null>(null);
    const [staffSignatureField, setStaffSignatureField] = useState<SignatureField | null>(null);
    const [currentSignatureFields, setCurrentSignatureFields] = useState<SignatureField[]>([]);


    // Fungsi untuk mengirim status proses ke backend
    const sendProcessStatus = useCallback(async (status: string, currentSessionId: string) => {
        try {
            await fetch(`${API_BASE_URL}/signatures/process/status/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    session_id: currentSessionId,
                    status: status,
                    created_by: user?.id || null
                })
            });
            console.log(`Status proses '${status}' berhasil dikirim untuk session ID: ${currentSessionId}`);
        } catch (error) {
            console.error("Gagal mengirim status proses:", error);
        }
    }, [API_BASE_URL, token, user?.id]);


    const placeSignatureOnPdf = useCallback(
        async (
            signatureDataUrl: string,
            currentSignatureData: SignatureApiResponse | null,
            pdfBytes: Uint8Array | null,
            category: 'Petugas' | 'Penerima'
        ) => {
            if (!signatureDataUrl || !currentSignatureData || !pdfBytes) {
                toast.error('Data tidak lengkap.');
                return;
            }
            try {
                // Selalu gunakan salinan baru Uint8Array
                const pdfDocToModify = await PDFDocument.load(new Uint8Array(pdfBytes));
                const pages = pdfDocToModify.getPages();

                const fields: SignatureField[] = JSON.parse(currentSignatureData.metadata.data.signature_fields);
                const field = fields.find((f) => f.category === category);
                if (!field) throw new Error(`Field untuk ${category} tidak ditemukan`);

                const pageIndex = field.page_signature - 1;
                if (pageIndex < 0 || pageIndex >= pages.length)
                    throw new Error(`Halaman tidak valid`);

                const page = pages[pageIndex];
                let signatureImage;

                const imageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());

                if (signatureDataUrl.startsWith('data:image/png') || signatureDataUrl.endsWith('.png')) {
                    signatureImage = await pdfDocToModify.embedPng(imageBytes);
                } else if (signatureDataUrl.startsWith('data:image/jpeg') || signatureDataUrl.endsWith('.jpeg') || signatureDataUrl.endsWith('.jpg')) {
                    signatureImage = await pdfDocToModify.embedJpg(imageBytes);
                } else {
                    throw new Error('Format gambar tidak didukung');
                }

                const pageHeight = page.getHeight();
                const width = 100; // Lebar tanda tangan di PDF
                const height = width / (signatureImage.width / signatureImage.height);
                const x = field.pos_x;
                const y = pageHeight - field.pos_y - height; // Koordinat Y PDF dihitung dari bawah

                page.drawImage(signatureImage, { x, y, width, height });

                const updated = await pdfDocToModify.save();
                setModifiedPdfBytes(updated);

                if (category === 'Penerima') setIsSigning(false);
            } catch (err: any) {
                console.error('Gagal menempatkan tanda tangan:', err);
                toast.error(`Gagal menempatkan tanda tangan: ${err.message}`);
                setIsSigning(false);
            }
        },
        []
    );

    // Fungsi untuk memuat ulang data PDF dan tanda tangan
    const loadPdfAndSignatureData = useCallback(async () => {
        if (!sessionId || !token || !API_BASE_URL) {
            setError('Data sesi atau token tidak tersedia.');
            setIsLoading(false);
            setIsPdfLoaded(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const startRes = await fetch(`${API_BASE_URL}/signatures/process/start/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!startRes.ok) {
                const errorData = await startRes.json();
                throw new Error(errorData.detail || 'Gagal mengambil data sesi');
            }
            const data: SignatureApiResponse = await startRes.json();
            setSignatureData(data);

            const pdfUrl = data?.metadata?.['signature-preview-metadata']?.access_url;
            if (!pdfUrl) throw new Error('URL PDF tidak tersedia');

            const pdfRes = await fetch(pdfUrl, { headers: { Authorization: `Bearer ${token}` } });
            if (!pdfRes.ok) {
                const errorData = await pdfRes.json();
                throw new Error(errorData.detail || 'Gagal mengambil PDF');
            }

            const arrayBuffer = await pdfRes.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);
            setModifiedPdfBytes(pdfBytes);

            const pdf = await pdfjs.getDocument(new Uint8Array(pdfBytes)).promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
            setIsPdfLoaded(true);

            const fields: SignatureField[] = JSON.parse(data.metadata.data.signature_fields);
            setCurrentSignatureFields(fields);
            setClientSignatureField(fields.find(f => f.category === 'Penerima') || null);
            setStaffSignatureField(fields.find(f => f.category === 'Petugas') || null);

            const primarySigId = data?.metadata?.data?.primary_signature;
            if (primarySigId) {
                const imgRes = await fetch(`${API_BASE_URL}/signatures/user/${primarySigId}/image/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (imgRes.ok) {
                    const imgData = await imgRes.json();
                    setPetugasSignatureImageUrl(imgData.image_url);
                    await placeSignatureOnPdf(imgData.image_url, data, new Uint8Array(pdfBytes), 'Petugas');
                }
            }
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Terjadi kesalahan saat memuat dokumen');
            setIsPdfLoaded(true);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, token, API_BASE_URL, placeSignatureOnPdf]);


    useEffect(() => {
        if (token) loadPdfAndSignatureData();
    }, [token, loadPdfAndSignatureData]);


    const handleSave = useCallback(
        async (dataUrl: string) => {
            setPenerimaSignatureDataUrl(dataUrl);
            setIsSigning(true);
            if (signatureData && modifiedPdfBytes) {
                await placeSignatureOnPdf(dataUrl, signatureData, modifiedPdfBytes, 'Penerima');
            }
        },
        [signatureData, modifiedPdfBytes, placeSignatureOnPdf]
    );

    const handleProcessPdf = async () => {
        setIsSubmitting(true);
        try {
            if (!modifiedPdfBytes) {
                throw new Error("PDF yang dimodifikasi tidak tersedia.");
            }
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            setSignedPdfBlob(blob);
            toast.success("Dokumen siap untuk dikirim!");
        } catch (err: any) {
            console.error("Error preparing PDF for submission:", err);
            toast.error(`Gagal menyiapkan dokumen: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitSignedPdfToApi = async () => {
        setIsSubmitting(true);
        try {
            if (!signedPdfBlob || !sessionId || !token || !API_BASE_URL) {
                throw new Error("Dokumen atau data sesi tidak lengkap untuk pengiriman.");
            }

            const formData = new FormData();
            formData.append('temp_file', signedPdfBlob, `signed_document_${sessionId}.pdf`);
            formData.append('session_id', sessionId);

            // 1. Kirim file PDF yang sudah ditandatangani
            const response = await fetch(`${API_BASE_URL}/signatures/process/temp-file/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengirim dokumen.');
            }

            toast.success('Dokumen berhasil dikirim!');

            // 2. Perbarui status sesi menjadi "client signed"
            await sendProcessStatus("client signed", sessionId);
            toast.success('Status tanda tangan berhasil diperbarui!');

        } catch (err: any) {
            console.error("Error submitting signed PDF or updating status:", err);
            toast.error(`Gagal mengirim dokumen atau memperbarui status: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Fungsi Baru: checkSignatureStatus ---
    const checkSignatureStatus = useCallback(async () => {
        if (!sessionId || !token || !API_BASE_URL) {
            toast.error("Session ID atau token tidak tersedia.");
            return;
        }

        setIsCheckingStatus(true);
        try {
            const statusRes = await fetch(`${API_BASE_URL}/signatures/process/status?sid=${sessionId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!statusRes.ok) {
                const errorData = await statusRes.json();
                throw new Error(errorData.detail || "Gagal mengambil status proses");
            }

            const statusResult: (string | StatusResponseObject)[] = await statusRes.json();

            const statusObjects = statusResult.filter(
                (item: any): item is StatusResponseObject => typeof item === 'object' && item !== null && 'status' in item && 'timestamp' in item
            );

            if (statusObjects.length === 0) {
                toast.warning("Tidak ada data status yang valid ditemukan.");
                return;
            }

            statusObjects.sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return dateB - dateA;
            });

            const latestStatusObject = statusObjects[0];
            const currentBackendStatus = latestStatusObject.status;

            if (currentBackendStatus === "retry") {
                toast.info("Status 'retry' diterima. Silakan tanda tangan ulang.");
                // --- AWAL PERUBAHAN PENTING DI SINI ---
                setPenerimaSignatureDataUrl(null); // Hapus tanda tangan penerima yang lama
                setSignedPdfBlob(null); // Hapus PDF yang sudah ditandatangani
                setIsSigning(false); // Pastikan CustomSignaturePad terlihat lagi
                await loadPdfAndSignatureData(); // PENTING: Memuat ulang PDF ASLI dan menerapkan kembali tanda tangan petugas jika ada.
                // --- AKHIR PERUBAHAN PENTING DI SINI ---
            } else if (currentBackendStatus === "client signed") {
                toast.success("Dokumen sudah ditandatangani oleh klien. Anda bisa melanjutkan ke pengiriman.");
                // Memuat ulang PDF untuk menampilkan tanda tangan penerima jika belum terlihat
                if (!penerimaSignatureDataUrl) {
                    await loadPdfAndSignatureData();
                }
            } else if (currentBackendStatus === "selesai") {
                toast.info("Proses tanda tangan sudah selesai dan dokumen telah difinalisasi.");
                // Mungkin navigasi ke halaman lain atau tampilkan informasi bahwa sudah selesai.
            } else if (currentBackendStatus === "dibatalkan") {
                toast.warning("Proses tanda tangan telah dibatalkan.");
            } else {
                toast.info(`Status saat ini: ${currentBackendStatus}. Harap tunggu.`);
            }

        } catch (err: any) {
            console.error("Error checking status:", err);
            toast.error(`Gagal cek status: ${err.message}`);
        } finally {
            setIsCheckingStatus(false);
        }
    }, [sessionId, token, API_BASE_URL, sendProcessStatus, penerimaSignatureDataUrl, loadPdfAndSignatureData]);

    // Placeholder untuk LoadingSpinner
    const LoadingSpinner: React.FC<{ size: string; message: string; isFullScreen?: boolean }> = ({ message, isFullScreen }) => (
        <div className={`flex flex-col items-center justify-center ${isFullScreen ? 'w-screen h-screen' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        </div>
    );

    const pageToRenderWidth = useMemo(() => {
        if (pdfContainerRef.current) {
            return Math.min(800, pdfContainerRef.current.offsetWidth - 40);
        }
        return null;
    }, [isPdfLoaded, pdfContainerRef.current?.offsetWidth]);


    if (error) {
        return <div className="text-red-500 p-4 text-center">{error}</div>;
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
            <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
                <div className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                        Dokumen untuk ditandatangani
                    </h2>
                    <div
                        ref={pdfContainerRef}
                        className="relative w-full max-w-[800px] mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700"
                    >
                        {numPages > 0 && modifiedPdfBytes && pdfDoc ? (
                            <PdfPageRenderer
                                pageNum={currentPage}
                                pdfBytes={modifiedPdfBytes}
                                petugasSignatureImageUrl={petugasSignatureImageUrl}
                                penerimaSignatureDataUrl={penerimaSignatureDataUrl}
                                signatureFieldsJson={signatureData?.metadata.data.signature_fields}
                                pdfDocProxy={pdfDoc}
                                pageWidth={pageToRenderWidth}
                            />
                        ) : (
                            !isLoading && <p className="p-4 text-center text-gray-600 dark:text-gray-400">Tidak ada halaman PDF.</p>
                        )}
                    </div>

                    {/* Navigasi halaman */}
                    {numPages > 0 && (
                        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                            Menampilkan halaman {currentPage} dari {numPages}.
                        </div>
                    )}
                    {numPages > 1 && (
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(numPages, p + 1))
                                }
                                disabled={currentPage === numPages}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar signature pad */}
                <div className="w-full lg:w-96 dark:bg-gray-800 shadow p-6 flex flex-col gap-4 overflow-y-auto">
                    {/* Kondisional: tampilkan SignaturePad jika penerima belum tanda tangan atau statusnya retry */}
                    {!penerimaSignatureDataUrl || (penerimaSignatureDataUrl && isSigning) ? (
                        <CustomSignaturePad onSave={handleSave} />
                    ) : (
                        <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md text-center text-gray-700 dark:text-gray-300">
                            <p>Tanda tangan Penerima sudah ada.</p>
                            <img src={penerimaSignatureDataUrl} alt="Penerima Signature" className="mx-auto mt-2 max-w-full h-auto" />
                        </div>
                    )}

                    {/* Tombol Cek Status */}
                    <button
                        onClick={checkSignatureStatus}
                        disabled={isCheckingStatus || isSubmitting}
                        className={`mt-4 px-4 py-2 rounded-md transition-colors ${isCheckingStatus || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {isCheckingStatus ? "Memeriksa Status..." : "Cek Status"}
                    </button>

                    {/* Button untuk memproses PDF (seperti "Siapkan Dokumen untuk Pengiriman") */}
                    <button
                        onClick={handleProcessPdf}
                        disabled={isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField}
                        className={`px-4 py-2 rounded-md transition-colors ${isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {isSubmitting && !signedPdfBlob
                            ? "Memproses PDF..."
                            : "Siapkan Dokumen untuk Pengiriman"}
                    </button>

                    {/* Button untuk mengirim dokumen (hanya muncul setelah disiapkan) */}
                    {signedPdfBlob && (
                        <button
                            onClick={handleSubmitSignedPdfToApi}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors"
                        >
                            {isSubmitting ? "Mengirim Dokumen..." : "Kirim Dokumen"}
                        </button>
                    )}

                    {/* Status Tanda Tangan */}
                    <div className="mt-auto border-t border-gray-300 dark:border-gray-600 pt-4 text-sm text-gray-700 dark:text-gray-300">
                        <p>Petugas: {petugasSignatureImageUrl ? 'Sudah ditandatangani' : 'Belum'}</p>
                        <p>Penerima: {penerimaSignatureDataUrl ? 'Sudah ditandatangani' : 'Belum'}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignSessionPage;