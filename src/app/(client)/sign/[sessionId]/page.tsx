'use client';
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
import { SignatureApiResponse, SignatureField } from '@/types/signatureProcess.types';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { PDFDocument, rgb } from 'pdf-lib';
import CustomSignaturePad from '@/components/canvas/SignaturePad';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfPageRendererProps {
    pageNum: number;
    pdfBytes: Uint8Array | null;
    petugasSignatureImageUrl: string | null;
    penerimaSignatureDataUrl: string | null;
    signatureFieldsJson: string | undefined;
    pdfDocProxy: PDFDocumentProxy | null;
    pageWidth: number | null; // Tambahkan prop untuk lebar halaman yang dirender
}

const PdfPageRenderer: React.FC<PdfPageRendererProps> = ({
    pageNum,
    pdfBytes,
    petugasSignatureImageUrl,
    penerimaSignatureDataUrl,
    signatureFieldsJson,
    pdfDocProxy,
    pageWidth, // Gunakan prop lebar halaman
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pageRenderedWidth, setPageRenderedWidth] = useState<number | null>(null);
    const [pageRenderedHeight, setPageRenderedHeight] = useState<number | null>(null);


    useEffect(() => {
        const renderPage = async () => {
            if (!canvasRef.current || !pdfBytes) return;

            const pdf = await pdfjs.getDocument(new Uint8Array(pdfBytes)).promise;
            const page = await pdf.getPage(pageNum);

            // Tentukan skala berdasarkan lebar yang diinginkan
            const viewport = page.getViewport({ scale: 1 });
            const desiredWidth = pageWidth || 800; // Gunakan prop pageWidth atau default ke 800
            const scale = desiredWidth / viewport.width;
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
        };

        renderPage();
    }, [pdfBytes, pageNum, pageWidth]);


    const getOverlayStyle = useCallback(
        (
            category: 'Petugas' | 'Penerima',
            field: SignatureField,
            canvasWidth: number,
            canvasHeight: number,
            originalPageViewport: pdfjs.PageViewport | null
        ): React.CSSProperties => {
            if (!originalPageViewport) return { display: 'none' };

            const pdfX = field.pos_x;
            const pdfY = field.pos_y; // Posisi Y dihitung dari bawah PDF

            // Ukuran default tanda tangan dalam poin PDF (ini bisa disesuaikan)
            const signatureWidthPdfPoints = 100;
            const signatureHeightPdfPoints = 50; // Asumsi tinggi proporsional, atau sesuaikan jika ada ukuran tetap

            const scaleFactor = canvasWidth / originalPageViewport.width;

            const displayX = pdfX * scaleFactor;
            const displayY = pdfY * scaleFactor;


            const displayWidth = signatureWidthPdfPoints * scaleFactor;
            const displayHeight = signatureHeightPdfPoints * scaleFactor;


            return {
                position: 'absolute',
                left: `${displayX}px`,
                top: `${displayY}px`,
                zIndex: 10,
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                border: `1px dashed ${category === 'Petugas' ? 'blue' : 'green'}`,
                backgroundImage: `url(${category === 'Petugas'
                    ? petugasSignatureImageUrl
                    : penerimaSignatureDataUrl
                    })`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            };
        },
        [petugasSignatureImageUrl, penerimaSignatureDataUrl]
    );

    const [petugasStyle, setPetugasStyle] = useState<React.CSSProperties>({ display: 'none' });
    const [penerimaStyle, setPenerimaStyle] = useState<React.CSSProperties>({ display: 'none' });

    useEffect(() => {
        const updateStyles = async () => {
            if (!signatureFieldsJson || !pdfDocProxy || !canvasRef.current || !pageRenderedWidth || !pageRenderedHeight) return;

            try {
                const fields: SignatureField[] = JSON.parse(signatureFieldsJson);
                const page = await pdfDocProxy.getPage(pageNum);
                const originalPageViewport = page.getViewport({ scale: 1 }); // Viewport asli untuk perhitungan koordinat

                const petugasField = fields.find((f) => f.category === 'Petugas' && f.page_signature === pageNum);
                if (petugasField && petugasSignatureImageUrl) {
                    const style = getOverlayStyle('Petugas', petugasField, pageRenderedWidth, pageRenderedHeight, originalPageViewport);
                    setPetugasStyle(style);
                } else {
                    setPetugasStyle({ display: 'none' });
                }

                const penerimaField = fields.find((f) => f.category === 'Penerima' && f.page_signature === pageNum);
                if (penerimaField && penerimaSignatureDataUrl) {
                    const style = getOverlayStyle('Penerima', penerimaField, pageRenderedWidth, pageRenderedHeight, originalPageViewport);
                    setPenerimaStyle(style);
                } else {
                    setPenerimaStyle({ display: 'none' });
                }

            } catch (e) {
                console.error('Error parsing signature_fields or getting page:', e);
                setPetugasStyle({ display: 'none' });
                setPenerimaStyle({ display: 'none' });
            }
        };

        updateStyles();
    }, [signatureFieldsJson, pdfDocProxy, pageNum, pageRenderedWidth, pageRenderedHeight, getOverlayStyle, petugasSignatureImageUrl, penerimaSignatureDataUrl]);


    return (
        <div className="relative mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
            {petugasSignatureImageUrl && <div style={petugasStyle} className="absolute bg-no-repeat bg-center bg-contain" />}
            {penerimaSignatureDataUrl && <div style={penerimaStyle} className="absolute bg-no-repeat bg-center bg-contain" />}
        </div>
    );
};


const SignSessionPage: React.FC = () => {
    const params = useParams();
    const sessionId = params.sessionId as string;
    const { token } = useAuthStore();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [signatureData, setSignatureData] = useState<SignatureApiResponse | null>(null);
    const [petugasSignatureImageUrl, setPetugasSignatureImageUrl] = useState<string | null>(null);
    const [penerimaSignatureDataUrl, setPenerimaSignatureDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSigning, setIsSigning] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modifiedPdfBytes, setModifiedPdfBytes] = useState<Uint8Array | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // State untuk mensimulasikan `isPdfLoaded`
    const [isPdfLoaded, setIsPdfLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);

    // Dummy data dan fungsi untuk menyamai struktur return dari contoh style
    const [documentUrl, setDocumentUrl] = useState<string | null>(null); // Akan diisi dengan data URL PDF
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const [pageScale, setPageScale] = useState(1); // Skala halaman
    const [clientSignatureField, setClientSignatureField] = useState<SignatureField | null>(null);
    const [staffSignatureField, setStaffSignatureField] = useState<SignatureField | null>(null);
    const [currentSignatureFields, setCurrentSignatureFields] = useState<SignatureField[]>([]);


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

                const fields: SignatureField[] = JSON.parse(currentSignatureData.metadata.data.data.signature_fields);
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
                const y = pageHeight - field.pos_y - height;

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
        [] // Dependensi toast dihapus karena tidak ada di scope ini atau sudah dari import
    );

    useEffect(() => {
        const fetchData = async () => {
            if (!sessionId || !token || !API_BASE_URL) {
                setError('Data sesi atau token tidak tersedia.');
                setIsLoading(false);
                setIsPdfLoaded(true); // Pastikan loading spinner hilang
                return;
            }
            try {
                const startRes = await fetch(`${API_BASE_URL}/signatures/process/start/${sessionId}`, );
                if (!startRes.ok) throw new Error('Gagal mengambil data sesi');
                const data: SignatureApiResponse = await startRes.json();
                setSignatureData(data);

                const pdfUrl = data?.metadata?.data?.['signature-preview-metadata']?.access_url;
                if (!pdfUrl) throw new Error('URL PDF tidak tersedia');

                // Set documentUrl untuk komponen Document (jika digunakan)
                setDocumentUrl(pdfUrl);

                const pdfRes = await fetch(pdfUrl, { headers: { Authorization: `Bearer ${token}` } });
                if (!pdfRes.ok) throw new Error('Gagal mengambil PDF');

                const arrayBuffer = await pdfRes.arrayBuffer(); // Ambil ArrayBuffer
                const pdfBytes = new Uint8Array(arrayBuffer); // Buat Uint8Array sekali
                setModifiedPdfBytes(pdfBytes);

                // Gunakan salinan baru untuk PDF.js
                const pdf = await pdfjs.getDocument(new Uint8Array(pdfBytes)).promise;
                setPdfDoc(pdf);
                setNumPages(pdf.numPages);
                setIsPdfLoaded(true); // PDF berhasil dimuat

                const fields: SignatureField[] = JSON.parse(data.metadata.data.data.signature_fields);
                setCurrentSignatureFields(fields);
                setClientSignatureField(fields.find(f => f.category === 'Penerima') || null);
                setStaffSignatureField(fields.find(f => f.category === 'Petugas') || null);


                const primarySigId = data?.metadata?.data?.data?.primary_signature;
                if (primarySigId) {
                    const imgRes = await fetch(`${API_BASE_URL}/signatures/user/${primarySigId}/image/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (imgRes.ok) {
                        const imgData = await imgRes.json();
                        setPetugasSignatureImageUrl(imgData.image_url);
                        // Gunakan salinan baru untuk menempatkan tanda tangan
                        await placeSignatureOnPdf(imgData.image_url, data, new Uint8Array(pdfBytes), 'Petugas');
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan');
                setIsPdfLoaded(true); // Pastikan loading spinner hilang meskipun ada error
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchData();
    }, [sessionId, token, API_BASE_URL, placeSignatureOnPdf]);

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

    // Fungsi dummy untuk menyamai gaya yang diberikan
    const handleSignatureSave = useCallback((dataUrl: string) => {
        setPenerimaSignatureDataUrl(dataUrl); 
    }, []);

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
            // Mungkin navigasi atau refresh data setelah berhasil
        } catch (err: any) {
            console.error("Error submitting signed PDF:", err);
            toast.error(`Gagal mengirim dokumen: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Placeholder untuk LoadingSpinner (Anda perlu mengganti ini dengan komponen LoadingSpinner Anda yang sebenarnya)
    const LoadingSpinner: React.FC<{ size: string; message: string; isFullScreen?: boolean }> = ({ message, isFullScreen }) => (
        <div className={`flex flex-col items-center justify-center ${isFullScreen ? 'w-screen h-screen' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        </div>
    );


    const onDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
        setNumPages(pdf.numPages);
        setIsPdfLoaded(true);
        // Hitung skala halaman berdasarkan lebar container jika diperlukan
        if (pdfContainerRef.current) {
            const containerWidth = pdfContainerRef.current.offsetWidth;
            const page =  await pdf.getPage(1); // Tunggu hingga Promise selesai dan dapatkan objek PDFPageProxy
            const viewport = page.getViewport({ scale: 1 });
            setPageScale(containerWidth / viewport.width);
        }
    };

    const handlePageRenderSuccess = () => {
        // Logika setelah halaman dirender jika diperlukan
    };


    const pageToRenderWidth = useMemo(() => {
        if (pdfContainerRef.current) {
            return Math.min(800, pdfContainerRef.current.offsetWidth - 40);
        }
        return null;
    }, [isPdfLoaded, pdfContainerRef.current?.offsetWidth]);


    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
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
                        {numPages > 0 && modifiedPdfBytes && pdfDoc ? (
                            <PdfPageRenderer
                                pageNum={currentPage}
                                pdfBytes={modifiedPdfBytes}
                                petugasSignatureImageUrl={petugasSignatureImageUrl}
                                penerimaSignatureDataUrl={penerimaSignatureDataUrl}
                                signatureFieldsJson={signatureData?.metadata.data.data.signature_fields}
                                pdfDocProxy={pdfDoc}
                                pageWidth={pageToRenderWidth} // Teruskan lebar yang dihitung
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
                    <CustomSignaturePad onSave={handleSave} /> {/* Menggunakan handleSave yang sudah ada */}

                    {/* Button untuk memproses PDF (seperti "Siapkan Dokumen untuk Pengiriman") */}
                    <button
                        onClick={handleProcessPdf}
                        disabled={isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField} // Sesuaikan logika disabled
                        className={`mt-4 px-4 py-2 rounded-md transition-colors ${isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField
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