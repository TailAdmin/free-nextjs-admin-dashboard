"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById, fetchSignerDelegations } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse, ProcessStartResponse, SignatureField, SignerDelegation } from "@/types/pdfTemplate.types";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import Select from "@/components/form/Select";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import ProcessPdfEditor from "../ProcessPdfEditor";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import ReactSelect from 'react-select'

export default function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const { token, user } = useAuthStore();

    const [doc, setDoc] = useState<DocTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [signerOptions, setSignerOptions] = useState<{ value: string; label: string, image? : string }[]>([]);
    const [selectedSigner, setSelectedSigner] = useState("");

    const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
    const [initialDocSignatureFields, setInitialDocSignatureFields] = useState<SignatureField[]>([]);

    const [showQR, setShowQR] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [signee_name, setSignee_name] = useState("");

    const [pdfRenderURL, setPdfRenderURL] = useState<string | null>(null);
    const [localUploadedFileURL, setLocalUploadedFileURL] = useState<string | null>(null);
    const [showDropzone, setShowDropzone] = useState(true);

    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [confirmSignatureUrl, setConfirmSignatureUrl] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://tanah3.darius.my.id/api/v1";
    const CLIENT_FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_FRONTEND_URL || "http://localhost:3000";

    useEffect(() => {
        const fetchInitialDocData = async () => {
            if (!token) { setLoading(false); return; }
            setLoading(true);
            try {
                const data = await fetchDocById(id, token);
                setDoc(data);
                setInitialDocSignatureFields(data.signature_fields || []);
                setSignatureFields(data.signature_fields || []);
                if (data.example_file) {
                    setPdfRenderURL(data.example_file);
                    setShowDropzone(false);
                } else {
                    setPdfRenderURL(null);
                    setShowDropzone(true);
                }
            } catch (error) {
                toast.error("Gagal memuat metadata dokumen.");
                setDoc(null);
                setSignatureFields([]);
                setInitialDocSignatureFields([]);
                setPdfRenderURL(null);
                setShowDropzone(true);
            } finally { setLoading(false); }
        };
        fetchInitialDocData();
    }, [id, token]);

    useEffect(() => {
        return () => { if (localUploadedFileURL) URL.revokeObjectURL(localUploadedFileURL); };
    }, [localUploadedFileURL]);

    const handleSaveSuccess = useCallback(() => {
        toast.success("Posisi tanda tangan berhasil disimpan di server!");
        setInitialDocSignatureFields([...signatureFields]);
    }, [signatureFields]);

    // Fungsi untuk mengirim status proses ke backend
    const sendProcessStatus = useCallback(async (status: string, currentSessionId: string) => {
        console.log(`Mengirim status proses: ${status} untuk session ID: ${currentSessionId}`);
        try {
            await fetch(`${API_URL}/signatures/process/status/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    session_id: currentSessionId,
                    status: status,
                })
            });
            console.log(`Status proses '${status}' berhasil dikirim untuk session ID: ${currentSessionId}`);
        } catch (error) {
            console.error("Gagal mengirim status proses:", error);
        }
    }, [API_URL, token]);


    const handleProcess = async () => {
        if (!doc || !doc.id || !selectedSigner || signatureFields.length < 2 || !pdfRenderURL || !signee_name) {
            toast.warning("Lengkapi data sebelum proses. Pastikan nama penerima, petugas, 2 posisi tanda tangan, dan file PDF tersedia.");
            return;
        }
        let pdfFileToSend: File | Blob | null = null;
        let fileName: string = "";
        if (localUploadedFileURL) {
            try {
                const response = await fetch(localUploadedFileURL);
                const blob = await response.blob();
                fileName = `uploaded_doc_${Date.now()}.pdf`;
                pdfFileToSend = new File([blob], fileName, { type: "application/pdf" });
            } catch (error) {
                toast.error("Gagal membaca file PDF lokal."); return;
            }
        } else if (doc.example_file) {
            try {
                const response = await fetch(doc.example_file);
                const blob = await response.blob();
                fileName = `template_doc_${doc.id}.pdf`;
                pdfFileToSend = new File([blob], fileName, { type: "application/pdf" });
            } catch (error) {
                toast.error("Gagal membaca file PDF template."); return;
            }
        } else {
            toast.error("Tidak ada file PDF yang tersedia untuk diproses. Harap unggah file terlebih dahulu."); return;
        }
        if (!pdfFileToSend) { toast.error("Gagal menyiapkan file PDF untuk dikirim."); return; }
        const formData = new FormData();
        formData.append("temp_file", pdfFileToSend);
        formData.append("signature_fields", JSON.stringify(signatureFields));
        formData.append("template_id", doc.id);
        formData.append("primary_signature", selectedSigner);
        formData.append("signee_name", signee_name);
        try {
            toast.info("Memulai proses tanda tangan...");
            const res = await fetch(`${API_URL}/signatures/process/start/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal memproses tanda tangan");
            }
            const result: ProcessStartResponse = await res.json();
            const sessionIdFromBackend = result.session_id;
            setSessionId(sessionIdFromBackend);
            await sendProcessStatus("proses", sessionIdFromBackend);
            const qrCodeValue = `${CLIENT_FRONTEND_BASE_URL}/sign/${sessionIdFromBackend}`;
            setQrValue(qrCodeValue);
            setShowQR(true);
            const accessFileUrl = result.metadata["confirm-signature-metadata"]["access-file"] || null;
            setConfirmSignatureUrl(accessFileUrl);
            toast.success("Proses tanda tangan berhasil dimulai");

        } catch (err: any) {
            toast.error(`Gagal memproses tanda tangan: ${err.message}`);
        }
    };

    const fetchConfirmSignatureUrl = async () => {
        if (!sessionId) {
            toast.warning("Session ID tidak ditemukan.");
            return;
        }

        try {
            toast.info("Memeriksa status tanda tangan...");
            const statusRes = await fetch(`${API_URL}/signatures/process/status?sid=${sessionId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!statusRes.ok) {
                const errorData = await statusRes.json();
                throw new Error(errorData.detail || "Gagal mengambil status proses");
            }

            const statusResult = await statusRes.json();

            // Logika untuk mendapatkan status dengan timestamp terakhir
            const statusObjects = statusResult.filter(
                (item: any) => typeof item === 'object' && item !== null && 'status' in item && 'timestamp' in item
            );

            if (statusObjects.length === 0) {
                toast.warning("Tidak ada data status yang valid ditemukan.");
                return;
            }

            // Urutkan berdasarkan timestamp secara menurun (terbaru paling atas)
            statusObjects.sort((a: any, b: any) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return dateB - dateA; // Untuk urutan menurun (terbaru ke terlama)
            });

            const latestStatusObject = statusObjects[0];
            const currentStatus = latestStatusObject.status;
            // Akhir logika baru

            // --- Validasi status: hanya lanjutkan jika "client signed" ---
            if (currentStatus !== "client signed") {
                toast.warning(`Tanda tangan belum selesai atau status tidak valid. Status saat ini: ${currentStatus || 'tidak diketahui'}. Harap tunggu penandatanganan klien selesai.`);
                return; // Hentikan proses pratinjau jika belum "client signed"
            }

            // Lanjutkan jika status sudah "client signed"
            toast.info("Tanda tangan sudah selesai oleh klien, memuat pratinjau...");
            const res = await fetch(`${API_URL}/signatures/process/start/${sessionId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Gagal mengambil metadata");
            const result = await res.json();

            const accessFileUrl =
                result?.metadata?.["confirm-signature-metadata"]?.["access-file"] || null;

            if (!accessFileUrl) {
                toast.error("URL Preview PDF tidak tersedia.");
                return;
            }

            const pdfRes = await fetch(accessFileUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!pdfRes.ok) throw new Error("Gagal mengambil file PDF");

            const blob = await pdfRes.blob();
            const fileURL = URL.createObjectURL(blob);

            setPreviewPdfUrl(fileURL);
            setIsPreviewModalOpen(true);
            toast.success("Pratinjau PDF berhasil dimuat.");
        } catch (err: any) {
            toast.error(`Gagal mengambil preview: ${err.message}`);
        }
    };

    const handleSignatureFieldsChange = useCallback((fields: SignatureField[]) => {
        setSignatureFields(fields);
    }, []);

    const handleFileUpload = async (files: File[]) => {
        const file = files?.[0];
        if (!file) { toast.warning("Tidak ada file yang dipilih."); return; }
        if (file.type !== "application/pdf") { toast.error("Format file tidak didukung. Harap unggah file PDF."); return; }
        toast.info("Mempersiapkan pratinjau file lokal...");
        try {
            if (localUploadedFileURL) URL.revokeObjectURL(localUploadedFileURL);
            const newLocalURL = URL.createObjectURL(file);
            setLocalUploadedFileURL(newLocalURL);
            setPdfRenderURL(newLocalURL);
            if (initialDocSignatureFields.length > 0) setSignatureFields([...initialDocSignatureFields]);
            else setSignatureFields([]);
            setShowDropzone(false);
            toast.success("Pratinjau file lokal berhasil dimuat.");
        } catch (error: any) {
            toast.error(`Gagal memuat pratinjau file: ${error.message}`);
        }
    };

    useEffect(() => {
        const loadSignerOptions = async () => {
            if (!token) return;
            try {
                const data: SignerDelegation[] = await fetchSignerDelegations(token);
                const options = data.map((item: SignerDelegation) => ({ value: item.id, label: item.owner , image: item.file ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR6-Y6uY-VKr_TPEiri-UILWJyBDFUnE-jyw&s"}));
                setSignerOptions(options);
                console.log(options)
                if (options.length > 0 && !selectedSigner) {
                    setSelectedSigner(options[0].value);
                }
            } catch (error: any) {
                toast.error(`Gagal memuat daftar penandatangan: ${error.message}`);
                setSignerOptions([]);
            }
        };
        loadSignerOptions();
    }, [token, selectedSigner]);

    const handleCancelProcess = async () => {
        if (!sessionId) {
            toast.error("Session ID tidak ditemukan untuk membatalkan.");
            return;
        }
        try {
            toast.info("Membatalkan proses tanda tangan...");
            const res = await fetch(`${API_URL}/signatures/process/cancel/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ session_id: sessionId })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal membatalkan proses tanda tangan");
            }
            toast.success("Proses tanda tangan berhasil dibatalkan.");
            // Kirim status "dibatalkan"
            await sendProcessStatus("dibatalkan", sessionId);
            // Reset state terkait proses
            setShowQR(false);
            setQrValue("");
            setSessionId(null);
            setConfirmSignatureUrl(null);
            setPreviewPdfUrl(null);
            setIsPreviewModalOpen(false);
            setSignee_name("");
            setSelectedSigner("");
        } catch (err: any) {
            toast.error(`Gagal membatalkan proses: ${err.message}`);
        }
    };

    // Fungsi baru untuk menangani proses retry
    const handleRetryProcess = async () => {
        if (!sessionId) {
            toast.error("Session ID tidak ditemukan untuk mencoba lagi.");
            return;
        }
        try {
            toast.info("Mengulang proses tanda tangan...");
            // Kirim status "retry" ke backend
            await sendProcessStatus("retry", sessionId);

            // Tutup modal pratinjau
            setIsPreviewModalOpen(false);
            setPreviewPdfUrl(null); // Clear preview URL
            setConfirmSignatureUrl(null); // Clear confirm signature URL

            // Opsional: Anda bisa memilih untuk mereset seluruh alur penandatanganan
            // kembali ke tahap awal (misal: menampilkan QR ulang, dll.)
            // Namun, karena Anda hanya ingin mengirim status retry, cukup tutup modal.
            // Jika backend Anda mengharapkan inisiasi ulang QR, Anda perlu memanggil handleProcess lagi
            // atau fungsi yang membuat QR baru.
            // Untuk skenario 'retry' yang sederhana, kita hanya mengirim status dan menutup modal.
            toast.success("Status 'retry' berhasil dikirim. Silakan mulai proses baru jika diperlukan.");

            // Jika Anda ingin mengulang seluruh alur setelah retry (misal, QR baru):
            // setShowQR(false);
            // setQrValue("");
            // setSessionId(null);
            // setSignee_name("");
            // setSelectedSigner("");
            // Jika perlu memulai proses baru: handleProcess();
            // PENTING: Keputusan ini tergantung pada bagaimana backend Anda menangani "retry".
            // Apakah "retry" berarti memulai sesi tanda tangan baru atau mencoba kembali sesi yang sama?
            // Saya asumsikan "retry" di sini berarti menandai sesi sebelumnya sebagai perlu diulang,
            // dan pengguna akan memulai proses baru secara manual dari halaman utama.
            // Jika "retry" berarti QR code yang sama harus berfungsi lagi atau QR baru harus dihasilkan,
            // logika tambahan diperlukan di sini atau di backend.

        } catch (err: any) {
            toast.error(`Gagal mengulang proses: ${err.message}`);
        }
    };


    const handleFinalizeProcess = async () => {
        if (!sessionId || !doc?.id || !selectedSigner || !signee_name) {
            toast.warning("Data tidak lengkap untuk menyelesaikan proses.");
            return;
        }

        try {
            toast.info("Menyelesaikan proses tanda tangan...");
            const res = await fetch(`${API_URL}/signatures/process/finalize/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_name: signee_name,
                    session_id: sessionId,
                    template_id: doc.id,
                    primary_signature: selectedSigner,
                    created_by: user?.id || null
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal menyelesaikan proses tanda tangan");
            }
            toast.success("Proses tanda tangan berhasil diselesaikan!");
            // Kirim status "selesai" setelah berhasil menyelesaikan
            await sendProcessStatus("selesai", sessionId);

            // Reset state setelah selesai
            setShowQR(false);
            setQrValue("");
            setSessionId(null);
            setConfirmSignatureUrl(null);
            setPreviewPdfUrl(null);
            setIsPreviewModalOpen(false);
            setSignee_name("");
            setSelectedSigner("");
        } catch (err: any) {
            toast.error(`Gagal menyelesaikan proses: ${err.message}`);
        }
    };


    if (loading || !doc) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500 min-h-screen">
                <LoadingSpinner message="Memuat data awal dokumen..." />
            </div>
        );
    }

    const docForPdfEditor: DocTemplateResponse = {
        ...doc,
        example_file: pdfRenderURL || doc.example_file,
    };

    return (
        <div className="container mx-auto px-2 py-4 flex flex-col md:flex-row gap-3">
            <div className="md:w-full lg:w-2/3">
                <div className="mb-3">
                    <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        Manajemen File Dokumen
                    </label>
                    {showDropzone ? (
                        <DropzoneComponent onDrop={handleFileUpload} />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowDropzone(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs"
                        >
                            Ganti File PDF
                        </button>
                    )}
                </div>
                {docForPdfEditor.example_file ? (
                    <ProcessPdfEditor
                        key={pdfRenderURL || "initial-editor"}
                        doc={docForPdfEditor}
                        initialSignatureFields={signatureFields}
                        onSignatureFieldsChange={handleSignatureFieldsChange}
                        onSaveSuccess={handleSaveSuccess}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Silakan unggah file PDF untuk memulai.
                    </div>
                )}
            </div>
            <div className="md:w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow rounded p-4 space-y-3">
                <Label className="text-xs">Masukan Nama Penerima</Label>
                <Input
                    type="text"
                    placeholder="Nama Penerima Dokumen"
                    required
                    value={signee_name}
                    onChange={(e) => setSignee_name(e.target.value)}
                    className="text-xs py-1"
                />
                <hr className="border-gray-200 dark:border-gray-700 my-2" />
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Pilih Penandatangan
                </h2>
                <div>
                    <label
                        htmlFor="signer"
                        className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                        Petugas Penandatangan
                    </label>
                    <ReactSelect
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                setSelectedSigner(selectedOption.value);
                            } else {
                                setSelectedSigner(""); // Or handle null/undefined as appropriate
                            }
                        }}
                        options={signerOptions}
                        placeholder="-- Pilih Petugas --"
                        defaultValue={selectedSigner}
                        className="text-xs"
                        formatOptionLabel={user => (
                        <div className="flex flex-row gap-2 text-center justify-center">
                        <div>
                        <p>{user.label}</p>
                        <img src={user.image} width={"100em"} alt="country-image" />
                        </div>
                        </div>
                    )}                    
                    />

                </div>
                <button
                    onClick={handleProcess}
                    disabled={
                        !selectedSigner ||
                        signatureFields.length < 2 ||
                        !pdfRenderURL ||
                        !signee_name
                    }
                    className={`
                        w-full py-2 rounded text-white font-medium text-xs transition-all duration-200
                        ${selectedSigner &&
                            signatureFields.length >= 2 &&
                            pdfRenderURL &&
                            signee_name
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:from-blue-700"
                            : "bg-gray-300 cursor-not-allowed"
                        }
                    `}
                >
                    Proses
                </button>
                {showQR && qrValue && (
                    <>
                        <button
                            onClick={handleCancelProcess}
                            className="bg-red-500 hover:bg-red-600 w-full py-2 rounded text-white font-medium text-xs transition-all duration-200 mt-2"
                        >
                            Batalkan Proses
                        </button>

                        <div className="mt-3 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-sm text-center animate-fadeIn">
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Scan QR untuk lanjutkan:
                            </p>
                            <div className="flex justify-center mb-1">
                                <QRCodeSVG value={qrValue} size={100} level="H" />
                            </div>
                            <p className="text-[10px] text-gray-500 break-all">{qrValue}</p>
                        </div>

                        <button
                            onClick={fetchConfirmSignatureUrl}
                            disabled={!sessionId}
                            className={`
                                w-full mt-2 py-1 font-medium rounded text-xs transition-colors
                                ${sessionId ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                            `}
                        >
                            Preview PDF
                        </button>
                    </>
                )}
            </div>
            {isPreviewModalOpen && previewPdfUrl && (
                <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} isFullscreen>
                    <div className="h-screen w-full flex flex-col">
                        <iframe
                            src={previewPdfUrl}
                            className="flex-1 w-full h-full border-none"
                            title="Preview PDF"
                        ></iframe>
                        <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleRetryProcess} // Memanggil fungsi handleRetryProcess
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-sm mr-2"
                            >
                                Coba Lagi
                            </button>
                            <button
                                onClick={handleFinalizeProcess}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}