"use client";
import React, { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse, SignatureField } from "@/types/pdfTemplate.types";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import ProcessPdfEditor from "../ProcessPdfEditor";
import Select from "@/components/form/Select";


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

    const handleProcess = async () => {
        if (!doc || !selectedSigner || signatureFields.length < 2) {
            toast.warning("Lengkapi data sebelum proses.");
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const CLIENT_FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_FRONTEND_URL || "http://localhost:3000";

        const payload = {
            signature_fields: signatureFields,
            template_id: doc.id,
            primary_signature: selectedSigner,
        };

        try {
            toast.info("Memulai proses tanda tangan...");
            const res = await fetch(`${API_URL}/signatures/process/start/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Gagal memproses tanda tangan");
            }

            const result = await res.json();
            const sessionIdFromBackend = result.session_id;
            const qrCodeValue = `${CLIENT_FRONTEND_BASE_URL}/sign/${sessionIdFromBackend}`;
            setQrValue(qrCodeValue);
            setShowQR(true);

            toast.success("Proses tanda tangan berhasil dimulai");
        } catch (err: any) {
            console.error("Page: Process error:", err);
            toast.error(`Gagal memproses tanda tangan: ${err.message}`);
        }
    };

    // --- PERBAIKAN DI SINI: Gunakan useCallback untuk menstabilkan fungsi ini ---
    const handleSignatureFieldsChange = useCallback((fields: SignatureField[]) => {
        setSignatureFields(fields); // Tidak perlu spread jika 'fields' sudah array baru
    }, []); // Dependensi kosong agar fungsi ini tidak dibuat ulang di setiap render

    useEffect(() => {
        const loadDoc = async () => {
            if (!token) return;
            try {
                const data = await fetchDocById(id, token);
                setDoc(data);
                if (data.signature_fields && data.signature_fields.length > 0) {
                    // Set fields langsung, biarkan ProcessPdfEditor menangani scaling awal
                    setSignatureFields(data.signature_fields);
                } else {
                    setSignatureFields([]);
                }
            } catch (error) {
                toast.error("Gagal memuat dokumen.");
            } finally {
                setLoading(false);
            }
        };
        loadDoc();
    }, [id, token]);

    useEffect(() => {
        const loadSigners = async () => {
            if (!token) return;
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            try {
                const res = await fetch(`${API_URL}/signatures/user/delegations/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || "Gagal mengambil daftar penandatangan");
                }
                const data = await res.json();
                const options = data.map((item: any) => ({
                    value: item.id,
                    label: item.owner,
                }));
                setSignerOptions(options);
            } catch (error: any) {
                toast.error(`Gagal memuat daftar penandatangan: ${error.message}`);
                setSignerOptions([]);
            }
        };
        loadSigners();
    }, [token]);

    if (loading || !doc)
        return (
            <div className="flex justify-center items-center h-full text-gray-500">Memuat dokumen...</div>
        );

    return (
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
            {/* PDF Editor */}
            <div className="md:w-full lg:w-2/3">
                <ProcessPdfEditor
                    doc={doc}
                    initialSignatureFields={signatureFields} // Teruskan ini sebagai prop terpisah
                    onSignatureFieldsChange={handleSignatureFieldsChange}
                />
            </div>

            {/* Sidebar Controls */}
            <div className="md:w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Pilih Penandatangan
                </h2>

                {/* Signer Selection */}
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

                {/* Process Button */}
                <button
                    onClick={handleProcess}
                    disabled={!selectedSigner || signatureFields.length < 2}
                    className={`
                        w-full py-3 rounded-lg text-white font-medium transition-all duration-200
                        ${selectedSigner && signatureFields.length >= 2
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:from-blue-700'
                            : 'bg-gray-300 cursor-not-allowed'}
                    `}
                >
                    Proses
                </button>

                {/* QR Code Section */}
                {showQR && qrValue && (
                    <div className="mt-6 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-center animate-fadeIn">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Scan QR untuk lanjutkan:</p>
                        <div className="flex justify-center mb-2">
                            <QRCodeSVG value={qrValue} size={160} level="H" />
                        </div>
                        <p className="text-xs text-gray-500">{qrValue}</p>
                    </div>
                )}
            </div>
        </div>
    );
}