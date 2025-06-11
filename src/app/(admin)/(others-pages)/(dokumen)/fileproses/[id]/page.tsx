"use client";

import React, { useEffect, useState, use } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";
import ProcessPdfEditor from "../ProcessPdfEditor";
import Select from "@/components/form/Select";  
import { ChevronDownIcon } from "@/icons";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { token } = useAuthStore();
    const [doc, setDoc] = useState<DocTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [signerOptions, setSignerOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedSigner, setSelectedSigner] = useState("");

    // Load PDF template doc
    useEffect(() => {
        const loadDoc = async () => {
            if (!token) return;

            try {
                const data = await fetchDocById(id, token);
                setDoc(data);
            } catch (error) {
                console.error("Gagal mengambil dokumen:", error);
            }
            finally {
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

                if (!res.ok) throw new Error("Gagal mengambil daftar penandatangan");

                const data = await res.json();
                console.log("Data mentah dari API signers:", data); 

                const options = data.map((item: any) => ({ 
                    value: item.owner, 
                    label: item.owner,        
                }));

                console.log("Signer options setelah map:", options);
                setSignerOptions(options);
            } catch (error) {
                console.error("Error fetching signers:", error);
                setSignerOptions([]);
            }
        };

        loadSigners();
    }, [token]);
    if (!doc || loading) return <div>Memuat dokumen...</div>;

    return (
        <div className="flex">
            {/* Left Panel */}
            <div className="flex-1 flex items-center justify-center min-h-0">
                <ProcessPdfEditor doc={doc} />
            </div>

            {/* Right Panel */}
            <div className="w-96 dark:bg-gray-900 shadow p-6 flex flex-col gap-4">
                <label
                    htmlFor="signer"
                    className="block mb-1 text-xl font-medium text-gray-600 dark:text-gray-300"
                >
                    Tanda Tangan Petugas
                </label>

                <div className="relative">
                    <Select
                        options={signerOptions}
                        placeholder="-- Pilih Petugas --"
                        onChange={(value) => setSelectedSigner(value)}
                        defaultValue={selectedSigner}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>

                <button
                    className={`mt-2 w-full py-3 rounded text-white ${
                        selectedSigner
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                    }`}
                    disabled={!selectedSigner}
                    onClick={() => {
                        console.log("Proses dengan signer:", selectedSigner);
                    }}
                >
                    Proses
                </button>
            </div>
        </div>
    );
}