"use client";

import React, { useEffect, useState, use } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse, SignatureField } from "@/types/pdfTemplate.types";
import { ChevronDownIcon } from "@/icons";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import ProcessPdfEditor from "../ProcessPdfEditor";
import Select from "@/components/form/Select";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { token } = useAuthStore();
    const [doc, setDoc] = useState<DocTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [signerOptions, setSignerOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedSigner, setSelectedSigner] = useState("");
    const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
    const [showQR, setShowQR] = useState(false);
    const [qrValue, setQrValue] = useState("");

    const handleProcess = async () => {
        console.log("Page: handleProcess called.");
        console.log("Page: doc:", doc);
        console.log("Page: selectedSigner:", selectedSigner);
        console.log("Page: signatureFields (dari state Page):", signatureFields);
        console.log("Page: signatureFields.length:", signatureFields.length);

        if (!doc || !selectedSigner || signatureFields.length < 2) {
            console.log("Page: Validation failed. Current state:", {
                docExists: !!doc,
                selectedSignerExists: !!selectedSigner,
                signatureFieldsCount: signatureFields.length
            });
            toast.warning("Lengkapi data (posisi tanda tangan dan petugas) sebelum proses.");
            return;
        }
        console.log("Page: Validation passed. Proceeding with process.");

        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
            toast.success("Proses tanda tangan berhasil dimulai");

            setQrValue(result.next_url);
            setShowQR(true);
        } catch (err: any) {
            console.error("Page: Process error:", err);
            toast.error(`Gagal memproses tanda tangan: ${err.message}`);
        }
    };

    // Callback untuk menerima data signatureFields dari ProcessPdfEditor
    const handleSignatureFieldsChange = (fields: SignatureField[]) => {
        setSignatureFields(fields);
        console.log("Page: signatureFields diperbarui dari ProcessPdfEditor:", fields);
    };

    useEffect(() => {
        const loadDoc = async () => {
            if (!token) return;

            try {
                const data = await fetchDocById(id, token);
                setDoc(data);
                if (data.signature_fields && data.signature_fields.length > 0) {
                    setSignatureFields(data.signature_fields);
                    console.log("Page: Initializing signatureFields from fetched doc:", data.signature_fields);
                } else if (signatureFields.length > 0) { 
                    setSignatureFields([]);
                    console.log("Page: No initial signatureFields in doc, resetting Page state.");
                } else {
                    console.log("Page: No initial signatureFields in doc, Page state already empty.");
                }
            } catch (error) {
                console.error("Page: Gagal mengambil dokumen:", error);
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
                console.error("Page: Error fetching signers:", error);
                toast.error(`Gagal memuat daftar penandatangan: ${error.message}`);
                setSignerOptions([]);
            }
        };

        loadSigners();
    }, [token]);

    if (!doc || loading) return <div className="p-6 text-center text-gray-500">Memuat dokumen...</div>;

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
                <ProcessPdfEditor
                    doc={doc}
                    onSignatureFieldsChange={handleSignatureFieldsChange}
                />
            </div>

            <div className="w-96 dark:bg-gray-900 shadow p-6 flex flex-col gap-4 overflow-y-auto">
                <label htmlFor="signer" className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    Tanda Tangan Petugas
                </label>

                <div className="relative">
                    <Select
                        options={signerOptions}
                        placeholder="-- Pilih Petugas --"
                        onChange={(value) => setSelectedSigner(value)}
                        defaultValue={selectedSigner}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                        <ChevronDownIcon />
                    </span>
                </div>

                <button
                    className={`mt-2 w-full py-3 rounded text-white transition-colors ${
                        selectedSigner && signatureFields.length >= 2
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                    }`}
                    disabled={!selectedSigner || signatureFields.length < 2}
                    onClick={handleProcess}
                >
                    Proses
                </button>

                {showQR && qrValue && (
                    <div className="mt-4 text-center p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Scan QR untuk melanjutkan proses tanda tangan:</p>
                        <div className="flex justify-center">
                            <QRCodeSVG value={qrValue} size={160} level="H" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}