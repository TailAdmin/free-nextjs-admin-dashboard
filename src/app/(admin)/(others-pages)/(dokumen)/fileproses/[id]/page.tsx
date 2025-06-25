"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById, fetchSignerDelegations } from "@/lib/services/pdfTemplateService";
import {
    DocTemplateResponse,
    ProcessStartResponse,
    SignatureField,
    SignerDelegation,
} from "@/types/pdfTemplate.types";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import Select from "@/components/form/Select";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import ProcessPdfEditor from "../ProcessPdfEditor";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const { token } = useAuthStore();
    const [doc, setDoc] = useState<DocTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [signerOptions, setSignerOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedSigner, setSelectedSigner] = useState("");
    const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
    const [showQR, setShowQR] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [pdfRenderURL, setPdfRenderURL] = useState<string | null>(null);
    const [localUploadedFileURL, setLocalUploadedFileURL] = useState<string | null>(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [signee_name, setSignee_name] = useState("");


    // Ambil NEXT_PUBLIC_API_BASE_URL dari .env
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://tanah3.darius.my.id/api/v1";
    const CLIENT_FRONTEND_BASE_URL =
        process.env.NEXT_PUBLIC_CLIENT_FRONTEND_URL || "http://localhost:3000";

    const loadDoc = useCallback(async () => {
        if (!token) {
            console.warn("Page: Token not available for fetching document.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await fetchDocById(id, token);
            setDoc(data);
            if (!localUploadedFileURL) {
                setSignatureFields(data.signature_fields || []);
                setPdfRenderURL(data.example_file || null);
            } else {
                console.log("Page: Local file is already set.", localUploadedFileURL);
            }
        } catch (error) {
            toast.error("Gagal memuat dokumen.");
            setDoc(null);
            setPdfRenderURL(null);
            setSignatureFields([]);
            console.error("Page: Error loading document:", error);
        } finally {
            setLoading(false);
        }
    }, [id, token, localUploadedFileURL]);

    useEffect(() => {
        loadDoc();
        return () => {
            if (localUploadedFileURL) {
                URL.revokeObjectURL(localUploadedFileURL);
            }
        };
    }, [loadDoc, localUploadedFileURL]);

    const handleSaveSuccess = useCallback(() => {
        toast.success("Posisi tanda tangan berhasil disimpan di server!");
        loadDoc();
    }, [loadDoc]);

    const handleProcess = async () => {
        if (!doc || !doc.id || !selectedSigner || signatureFields.length < 2 || !pdfRenderURL) {
            toast.warning("Lengkapi data sebelum proses.");
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
                console.error("Failed to convert local PDF URL to File:", error);
                toast.error("Gagal membaca file PDF lokal.");
                return;
            }
        } else if (doc.example_file) {
            try {
                const response = await fetch(doc.example_file);
                const blob = await response.blob();
                const urlParts = doc.example_file.split("/");
                fileName = urlParts[urlParts.length - 1].split("?")[0] || `template_doc_${doc.id}.pdf`;
                pdfFileToSend = new File([blob], fileName, { type: "application/pdf" });
            } catch (error) {
                console.error("Failed to fetch example_file from URL:", error);
                toast.error("Gagal mengambil file PDF dari server.");
                return;
            }
        } else {
            toast.error("Tidak ada file PDF yang tersedia untuk diproses.");
            return;
        }

        if (!pdfFileToSend) {
            toast.error("Gagal menyiapkan file PDF untuk dikirim.");
            return;
        }

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal memproses tanda tangan");
            }

            const result: ProcessStartResponse = await res.json();
            const sessionIdFromBackend = result.session_id;

            const qrCodeValue = `${CLIENT_FRONTEND_BASE_URL}/sign/${sessionIdFromBackend}`;
            setQrValue(qrCodeValue);
            setShowQR(true);

            // Simpan access-file dari session untuk preview
            const previewUrl = `${API_URL}/signatures/process/temp-file/${sessionIdFromBackend}/`;
            setPreviewPdfUrl(previewUrl);
            setIsPreviewModalOpen(true);

            toast.success("Proses tanda tangan berhasil dimulai");
        } catch (err: any) {
            console.error("Page: Process error:", err);
            toast.error(`Gagal memproses tanda tangan: ${err.message}`);
        }
    };

    const handleSignatureFieldsChange = useCallback((fields: SignatureField[]) => {
        setSignatureFields(fields);
    }, []);

    const handleFileUpload = async (files: File[]) => {
        const file = files?.[0];
        if (!file) {
            toast.warning("Tidak ada file yang dipilih.");
            return;
        }
        if (file.type !== "application/pdf") {
            toast.error("Format file tidak didukung. Harap unggah file PDF.");
            return;
        }

        toast.info("Mempersiapkan pratinjau file lokal...");
        try {
            if (localUploadedFileURL) {
                URL.revokeObjectURL(localUploadedFileURL);
            }
            const newLocalURL = URL.createObjectURL(file);
            setLocalUploadedFileURL(newLocalURL);
            setPdfRenderURL(newLocalURL);
            setSignatureFields([]);
            setShowDropzone(false);
            toast.success("Pratinjau file lokal berhasil dimuat.");
        } catch (error: any) {
            console.error("Page: File preview error:", error);
            toast.error(`Gagal memuat pratinjau file: ${error.message}`);
        }
    };

    useEffect(() => {
        const loadSignerOptions = async () => {
            if (!token) {
                console.warn("Page: Token not available for fetching signer delegations.");
                return;
            }
            try {
                const data: SignerDelegation[] = await fetchSignerDelegations(token);
                const options = data.map((item: SignerDelegation) => ({
                    value: item.id,
                    label: item.owner,
                }));
                setSignerOptions(options);
            } catch (error: any) {
                toast.error(`Gagal memuat daftar penandatangan: ${error.message}`);
                setSignerOptions([]);
                console.error("Page: Error loading signer delegations:", error);
            }
        };
        loadSignerOptions();
    }, [token]);

    if (loading || !doc || !doc.id || !pdfRenderURL) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500 min-h-screen">
                <LoadingSpinner message="Memuat dokumen..." />
            </div>
        );
    }

    const docForPdfEditor: DocTemplateResponse = {
        ...doc,
        example_file: pdfRenderURL,
    };

    return (
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-full lg:w-2/3">
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Manajemen File Dokumen
                    </label>
                    {!showDropzone && (
                        <button
                            type="button"
                            onClick={() => setShowDropzone(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                        >
                            Ganti File PDF
                        </button>
                    )}
                    {showDropzone && <DropzoneComponent onDrop={handleFileUpload} />}
                </div>
                {pdfRenderURL ? (
                    <ProcessPdfEditor
                        doc={docForPdfEditor}
                        initialSignatureFields={signatureFields}
                        onSignatureFieldsChange={handleSignatureFieldsChange}
                        onSaveSuccess={handleSaveSuccess}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                        Tidak ada file PDF untuk ditampilkan. Silakan unggah file baru.
                    </div>
                )}
            </div>

            <div className="md:w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
                <Label>Masukan Nama Penerima</Label>
                <Input type="text" placeholder="Felas" required value={signee_name} onChange={(e) => setSignee_name(e.target.value)}/>
                <hr className="border-gray-200 dark:border-gray-700" />

                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Pilih Penandatangan</h2>
                <div>
                    <label htmlFor="signer" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Petugas Penandatangan
                    </label>
                    <Select
                        options={signerOptions}
                        placeholder="-- Pilih Petugas --"
                        onChange={(value) => setSelectedSigner(value)}
                        defaultValue={selectedSigner}
                    />
                </div>

                <button
                    onClick={handleProcess}
                    disabled={!selectedSigner || signatureFields.length < 2 || !pdfRenderURL}
                    className={`
            w-full py-3 rounded-lg text-white font-medium transition-all duration-200
            ${selectedSigner && signatureFields.length >= 2 && pdfRenderURL
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:from-blue-700'
                            : 'bg-gray-300 cursor-not-allowed'
                        }
          `}
                >
                    Proses
                </button>

                {showQR && qrValue && (
                    <>
                        <div className="mt-6 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-center animate-fadeIn">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Scan QR untuk lanjutkan:</p>
                            <div className="flex justify-center mb-2">
                                <QRCodeSVG value={qrValue} size={160} level="H" />
                            </div>
                            <p className="text-xs text-gray-500">{qrValue}</p>
                        </div>

                        {/* Tombol Preview */}
                        <button
                            onClick={() => setIsPreviewModalOpen(true)}
                            className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Preview PDF
                        </button>
                    </>
                )}
            </div>

            {/* Modal Preview PDF */}
            {previewPdfUrl && (
                <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} isFullscreen>
                    <div className="h-screen w-full flex flex-col">
                        <iframe
                            src={previewPdfUrl}
                            className="flex-1 w-full h-full border-none"
                            title="Preview PDF"
                        ></iframe>
                    </div>
                </Modal>
            )}
        </div>
    );
}