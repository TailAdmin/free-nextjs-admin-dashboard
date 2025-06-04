"use client";

import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useSignatureFieldStore } from "@/lib/stores/useSignatureFieldsStore";
import { updateDocWithSignatures } from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ProcessPdfEditorProps {
    doc: DocTemplateResponse;
    onSaveSuccess?: () => void;
}

export default function ProcessPdfEditor({ doc, onSaveSuccess }: ProcessPdfEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { signatureFields, setSignatureFields } = useSignatureFieldStore();
    const { token } = useAuthStore();
    const [numPages, setNumPages] = useState<number>();

    const [petugasPos, setPetugasPos] = useState<{ x: number; y: number } | null>(null);
    const [penerimaPos, setPenerimaPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (doc?.signature_fields?.length > 0) {
            const petugas = doc.signature_fields.find((f) => f.category === "Petugas");
            const penerima = doc.signature_fields.find((f) => f.category === "Penerima");

            if (petugas) {
                setPetugasPos({ x: petugas.pos_x, y: petugas.pos_y });
            }

            if (penerima) {
                setPenerimaPos({ x: penerima.pos_x, y: penerima.pos_y });
            }

            setSignatureFields(doc.signature_fields);
        }
    }, [doc, setSignatureFields]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!petugasPos) {
            setPetugasPos({ x, y });
            setSignatureFields([
                ...signatureFields.filter((f) => f.category !== "Petugas"),
                { category: "Petugas", pos_x: Math.round(x), pos_y: Math.round(y) },
            ]);
            toast.success("Posisi tanda tangan Petugas telah ditentukan");
        } else if (!penerimaPos) {
            setPenerimaPos({ x, y });
            setSignatureFields([
                ...signatureFields.filter((f) => f.category !== "Penerima"),
                { category: "Penerima", pos_x: Math.round(x), pos_y: Math.round(y) },
            ]);
            toast.success("Posisi tanda tangan Penerima telah ditentukan");
        } else {
            toast.warning("Posisi tanda tangan sudah lengkap (2 posisi)");
        }
    };

    const handleReset = () => {
        setPetugasPos(null);
        setPenerimaPos(null);
        setSignatureFields([]);
        toast.info("Semua posisi tanda tangan telah direset");
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const handleSubmit = async () => {
        if (!token || !doc.id) {
            toast.error("Token atau ID dokumen tidak tersedia");
            return;
        }

        if (!petugasPos || !penerimaPos) {
            toast.warning("Silakan tambahkan 2 posisi tanda tangan");
            return;
        }

        try {
            const payload = signatureFields.map(field => ({
                ...field,
                pos_x: field.pos_x,
                pos_y: field.pos_y,
            }));

            await updateDocWithSignatures(doc.id.toString(), payload, token);
            toast.success("Tanda tangan berhasil disimpan");
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error("Gagal simpan:", error);
            toast.error("Gagal menyimpan posisi tanda tangan");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg text-gray-900 dark:text-gray-300">Letakkan Tanda Tangan</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                Klik pada area PDF untuk menentukan posisi tanda tangan:
            </p>

            {/* Preview PDF */}
            <div
                ref={canvasRef}
                onClick={handleClick}
                className="relative w-full max-w-[800px] mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden cursor-crosshair bg-white"
                style={{ aspectRatio: "210 / 297" }}
            >
                <Document file={doc.example_file} className="w-full h-full" onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={1} className="w-full h-full" />
                </Document>

                {/* Marker Petugas */}
                {petugasPos && (
                    <div
                        className="absolute flex items-center space-x-1 bg-red-500 text-white rounded px-1 py-0.5 text-xs font-semibold shadow-md z-10"
                        style={{ left: `${petugasPos.x}px`, top: `${petugasPos.y}px` }}
                    >
                        <div className="w-3 h-3 rounded-full bg-white" />
                        <span>Petugas</span>
                    </div>
                )}

                {/* Marker Penerima */}
                {penerimaPos && (
                    <div
                        className="absolute flex items-center space-x-1 bg-green-600 text-white rounded px-1 py-0.5 text-xs font-semibold shadow-md z-10"
                        style={{ left: `${penerimaPos.x}px`, top: `${penerimaPos.y}px` }}
                    >
                        <div className="w-3 h-3 rounded-full bg-white" />
                        <span>Penerima</span>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Hanya halaman pertama yang ditampilkan untuk penempatan tanda tangan.
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleSubmit}
                    disabled={!petugasPos || !penerimaPos}
                    className={`px-4 py-2 rounded text-white transition-colors ${petugasPos && penerimaPos
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                        }`}
                >
                    Simpan Posisi
                </button>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                    Reset Posisi
                </button>
            </div>
        </div>
    );
}