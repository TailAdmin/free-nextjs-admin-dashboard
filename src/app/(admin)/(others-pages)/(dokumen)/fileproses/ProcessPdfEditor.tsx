"use client";

import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { DocTemplateResponse, SignatureField, ProcessPdfEditorProps } from "@/types/pdfTemplate.types";
import { updateDocWithSignatures } from "@/lib/services/pdfTemplateService";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ProcessPdfEditor({ doc, onSaveSuccess, onSignatureFieldsChange }: ProcessPdfEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [signatureFieldsLocal, setSignatureFieldsLocal] = useState<SignatureField[]>([]);
    const { token } = useAuthStore();
    const [numPages, setNumPages] = useState<number>();

    const [petugasPos, setPetugasPos] = useState<{ x: number; y: number } | null>(null);
    const [penerimaPos, setPenerimaPos] = useState<{ x: number; y: number } | null>(null);

    const areSignatureFieldsEqual = (arr1: SignatureField[], arr2: SignatureField[]) => {
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort((a, b) => a.category.localeCompare(b.category));
        const sorted2 = [...arr2].sort((a, b) => a.category.localeCompare(b.category));
        for (let i = 0; i < sorted1.length; i++) {
            if (sorted1[i].category !== sorted2[i].category ||
                sorted1[i].pos_x !== sorted2[i].pos_x ||
                sorted1[i].pos_y !== sorted2[i].pos_y) {
                return false;
            }
        }
        return true;
    };


    useEffect(() => {
        const initialFields: SignatureField[] = [];
        let newPetugasPos: { x: number; y: number } | null = null;
        let newPenerimaPos: { x: number; y: number } | null = null;

        if (doc?.signature_fields?.length > 0) {
            const petugas = doc.signature_fields.find((f) => f.category === "Petugas");
            const penerima = doc.signature_fields.find((f) => f.category === "Penerima");

            if (petugas) {
                newPetugasPos = { x: petugas.pos_x, y: petugas.pos_y };
                initialFields.push({ category: "Petugas", pos_x: petugas.pos_x, pos_y: petugas.pos_y });
            }

            if (penerima) {
                newPenerimaPos = { x: penerima.pos_x, y: penerima.pos_y };
                initialFields.push({ category: "Penerima", pos_x: penerima.pos_x, pos_y: penerima.pos_y });
            }
        }

        if (!areSignatureFieldsEqual(signatureFieldsLocal, initialFields)) {
            setPetugasPos(newPetugasPos);
            setPenerimaPos(newPenerimaPos);
            setSignatureFieldsLocal(initialFields);
            onSignatureFieldsChange(initialFields);
        } else {
        }
    }, [doc, onSignatureFieldsChange, signatureFieldsLocal]); 


    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let updatedFields: SignatureField[] = [...signatureFieldsLocal];

        if (!petugasPos) {
            setPetugasPos({ x, y });
            updatedFields = updatedFields.filter((f) => f.category !== "Petugas");
            updatedFields.push({ category: "Petugas", pos_x: Math.round(x), pos_y: Math.round(y) });
            toast.success("Posisi tanda tangan Petugas telah ditentukan");
        } else if (!penerimaPos) {
            setPenerimaPos({ x, y });
            updatedFields = updatedFields.filter((f) => f.category !== "Penerima");
            updatedFields.push({ category: "Penerima", pos_x: Math.round(x), pos_y: Math.round(y) });
            toast.success("Posisi tanda tangan Penerima telah ditentukan");
        } else {
            toast.warning("Posisi tanda tangan sudah lengkap (2 posisi)");
            return;
        }

        setSignatureFieldsLocal(updatedFields);
        onSignatureFieldsChange(updatedFields);
        console.log("ProcessPdfEditor: Signature fields updated via click:", updatedFields);
    };

    const handleReset = () => {
        setPetugasPos(null);
        setPenerimaPos(null);
        setSignatureFieldsLocal([]);
        onSignatureFieldsChange([]);
        toast.info("Semua posisi tanda tangan telah direset");
        console.log("ProcessPdfEditor: Signature fields reset.");
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const handleSubmit = async () => {
        if (!token || !doc.id) {
            toast.error("Token atau ID dokumen tidak tersedia");
            return;
        }

        if (signatureFieldsLocal.length < 2) {
            toast.warning("Silakan tambahkan 2 posisi tanda tangan sebelum menyimpan.");
            return;
        }

        try {
            await updateDocWithSignatures(doc.id.toString(), signatureFieldsLocal, token);
            toast.success("Tanda tangan berhasil disimpan");
            if (onSaveSuccess) onSaveSuccess();
            console.log("ProcessPdfEditor: Signature positions saved successfully.");
        } catch (error) {
            console.error("ProcessPdfEditor: Gagal simpan:", error);
            toast.error("Gagal menyimpan posisi tanda tangan");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg text-gray-900 dark:text-gray-300">Letakkan Tanda Tangan</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                Klik pada area PDF untuk menentukan posisi tanda tangan:
            </p>

            <div
                ref={canvasRef}
                onClick={handleClick}
                className="relative w-full max-w-[800px] mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-white"
                style={{ aspectRatio: "210 / 297", cursor: "crosshair" }}
            >
                <Document file={doc.example_file} className="w-full h-full" onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={1} className="w-full h-full" />
                </Document>

                {petugasPos && (
                    <div
                        className="absolute flex items-center space-x-1 bg-red-500 text-white rounded px-1 py-0.5 text-xs font-semibold shadow-md z-10"
                        style={{ left: `${petugasPos.x}px`, top: `${petugasPos.y}px` }}
                    >
                        <div className="w-3 h-3 rounded-full bg-white" />
                        <span>Petugas</span>
                    </div>
                )}

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
                    disabled={signatureFieldsLocal.length < 2}
                    className={`px-4 py-2 rounded text-white transition-colors ${signatureFieldsLocal.length >= 2
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