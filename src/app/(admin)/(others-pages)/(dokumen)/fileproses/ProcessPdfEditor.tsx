// src/components/documents/ProcessPdfEditor.tsx
"use client"

import React, { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { fabric } from 'fabric'; // Import Fabric.js
import { useAuthStore } from "@/lib/stores/useAuthStore";
import {
    DocTemplateResponse,
    SignatureField,
    ProcessPdfEditorProps,
} from "@/types/pdfTemplate.types";
import { updateDocWithSignatures } from "@/lib/services/pdfTemplateService";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ProcessPdfEditor({
    doc,
    onSaveSuccess,
    onSignatureFieldsChange,
    initialSignatureFields,
}: ProcessPdfEditorProps) {
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    
    const [signatureFieldsLocal, setSignatureFieldsLocal] = useState<SignatureField[]>([]);
    const { token } = useAuthStore();
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageScale, setPageScale] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [originalPageWidth, setOriginalPageWidth] = useState<number>(794);
    const [isCanvasMode, setIsCanvasMode] = useState<boolean>(false);
    const [selectedTool, setSelectedTool] = useState<'signature' | 'text' | 'rectangle'>('signature');

    // Store signature field objects mapped to pages
    const [fabricObjects, setFabricObjects] = useState<Map<number, fabric.Object[]>>(new Map());

    const calculateScale = useCallback(() => {
        if (pdfContainerRef.current) {
            const container = pdfContainerRef.current;
            const availableWidth = container.offsetWidth - 40;
            const maxWidth = Math.min(availableWidth, 800);
            setContainerWidth(maxWidth);
            
            const scale = maxWidth / originalPageWidth;
            setPageScale(scale);
            return scale;
        }
        return 1;
    }, [originalPageWidth]);

    // Initialize Fabric.js canvas
    const initializeFabricCanvas = useCallback(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: containerWidth,
                height: containerWidth * 1.414, // A4 aspect ratio
                backgroundColor: 'transparent',
                selection: true,
                preserveObjectStacking: true,
            });

            // Configure canvas interactions
            canvas.on('object:added', (e) => {
                const obj = e.target;
                if (obj) {
                    // Add metadata to identify signature fields
                    obj.set({
                        id: `signature-${Date.now()}-${Math.random()}`,
                        category: obj.get('category') || 'Petugas',
                        page: currentPage
                    });
                }
            });

            canvas.on('object:modified', (e) => {
                updateSignatureFieldsFromCanvas();
            });

            canvas.on('object:removed', (e) => {
                updateSignatureFieldsFromCanvas();
            });

            fabricCanvasRef.current = canvas;
        }
    }, [containerWidth, currentPage]);

    // Update signature fields based on canvas objects
    const updateSignatureFieldsFromCanvas = useCallback(() => {
        if (!fabricCanvasRef.current) return;

        const objects = fabricCanvasRef.current.getObjects();
        const newFields: SignatureField[] = [];

        objects.forEach((obj) => {
            const category = obj.get('category');
            const page = obj.get('page') || currentPage;
            
            if (category && (category === 'Petugas' || category === 'Penerima')) {
                // Convert canvas coordinates to PDF coordinates
                const pdfX = Math.round((obj.left! / containerWidth) * originalPageWidth);
                const pdfY = Math.round((obj.top! / (containerWidth * 1.414)) * (originalPageWidth * 1.414));

                newFields.push({
                    category,
                    pos_x: pdfX,
                    pos_y: pdfY,
                    page_signature: page
                });
            }
        });

        setSignatureFieldsLocal(newFields);
        onSignatureFieldsChange(newFields);
    }, [containerWidth, originalPageWidth, currentPage, onSignatureFieldsChange]);

    // Add signature field to canvas
    const addSignatureField = useCallback((category: 'Petugas' | 'Penerima', x: number, y: number) => {
        if (!fabricCanvasRef.current) return;

        // Remove existing signature of same category
        const objects = fabricCanvasRef.current.getObjects();
        objects.forEach(obj => {
            if (obj.get('category') === category) {
                fabricCanvasRef.current!.remove(obj);
            }
        });

        // Create signature placeholder
        const signatureBox = new fabric.Rect({
            left: x - 50,
            top: y - 15,
            width: 100,
            height: 30,
            fill: category === 'Petugas' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
            stroke: category === 'Petugas' ? '#ef4444' : '#22c55e',
            strokeWidth: 2,
            category: category,
            page: currentPage,
            selectable: true,
            hasControls: true,
            hasBorders: true,
        });

        // Add text label
        const label = new fabric.Text(category, {
            left: x - 25,
            top: y - 5,
            fontSize: 12,
            fill: category === 'Petugas' ? '#dc2626' : '#16a34a',
            category: category,
            page: currentPage,
            selectable: false,
            evented: false,
        });

        fabricCanvasRef.current.add(signatureBox);
        fabricCanvasRef.current.add(label);
        fabricCanvasRef.current.renderAll();

        toast.success(`Posisi ${category} berhasil ditentukan pada halaman ${currentPage}.`);
    }, [currentPage]);

    // Add text annotation
    const addTextAnnotation = useCallback((x: number, y: number) => {
        if (!fabricCanvasRef.current) return;

        const text = new fabric.IText('Click to edit', {
            left: x,
            top: y,
            fontSize: 14,
            fill: '#000000',
            fontFamily: 'Arial',
            category: 'text',
            page: currentPage,
        });

        fabricCanvasRef.current.add(text);
        fabricCanvasRef.current.renderAll();
    }, [currentPage]);

    // Add rectangle annotation
    const addRectangle = useCallback((x: number, y: number) => {
        if (!fabricCanvasRef.current) return;

        const rect = new fabric.Rect({
            left: x - 25,
            top: y - 15,
            width: 50,
            height: 30,
            fill: 'transparent',
            stroke: '#3b82f6',
            strokeWidth: 2,
            category: 'rectangle',
            page: currentPage,
        });

        fabricCanvasRef.current.add(rect);
        fabricCanvasRef.current.renderAll();
    }, [currentPage]);

    // Handle canvas click based on selected tool
    const handleCanvasClick = useCallback((e: fabric.IEvent<MouseEvent>) => {
        if (!fabricCanvasRef.current || !e.pointer) return;

        const { x, y } = e.pointer;

        switch (selectedTool) {
            case 'signature':
                let targetCategory: "Petugas" | "Penerima" | null = null;
                if (!signatureFieldsLocal.some(f => f.category === "Petugas")) {
                    targetCategory = "Petugas";
                } else if (!signatureFieldsLocal.some(f => f.category === "Penerima")) {
                    targetCategory = "Penerima";
                } else {
                    toast.warning("Anda sudah menentukan kedua posisi (Petugas dan Penerima).");
                    return;
                }
                addSignatureField(targetCategory, x, y);
                break;
            case 'text':
                addTextAnnotation(x, y);
                break;
            case 'rectangle':
                addRectangle(x, y);
                break;
        }
    }, [selectedTool, signatureFieldsLocal, addSignatureField, addTextAnnotation, addRectangle]);

    // Switch between canvas and traditional mode
    const toggleCanvasMode = useCallback(() => {
        setIsCanvasMode(!isCanvasMode);
        if (!isCanvasMode) {
            // Initialize canvas when switching to canvas mode
            setTimeout(() => {
                initializeFabricCanvas();
                if (fabricCanvasRef.current) {
                    fabricCanvasRef.current.on('mouse:up', handleCanvasClick);
                }
            }, 100);
        } else {
            // Clean up canvas when switching back
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        }
    }, [isCanvasMode, initializeFabricCanvas, handleCanvasClick]);

    // Handle window resize
    useEffect(() => {
        const debouncedResize = debounce(() => {
            calculateScale();
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setDimensions({
                    width: containerWidth,
                    height: containerWidth * 1.414
                });
                fabricCanvasRef.current.renderAll();
            }
        }, 150);

        window.addEventListener('resize', debouncedResize);
        calculateScale();

        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    }, [calculateScale, containerWidth]);

    // Load initial signature fields
    useEffect(() => {
        if (JSON.stringify(initialSignatureFields) !== JSON.stringify(signatureFieldsLocal)) {
            setSignatureFieldsLocal(initialSignatureFields);
        }
    }, [initialSignatureFields]);

    // Update canvas when page changes
    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.clear();
            
            // Load signature fields for current page
            const currentPageFields = signatureFieldsLocal.filter(f => f.page_signature === currentPage);
            currentPageFields.forEach(field => {
                const x = (field.pos_x / originalPageWidth) * containerWidth;
                const y = (field.pos_y / (originalPageWidth * 1.414)) * (containerWidth * 1.414);
                addSignatureField(field.category, x, y);
            });
        }
    }, [currentPage, containerWidth, originalPageWidth]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfLoading(false);
        setCurrentPage(1);
        calculateScale();
    }, [calculateScale]);

    const onPageLoadSuccess = useCallback((page: any) => {
        const pageWidth = page.originalWidth || 794;
        setOriginalPageWidth(pageWidth);
        calculateScale();
    }, [calculateScale]);

    const onDocumentLoadError = useCallback((error: any) => {
        console.error("Error loading PDF:", error);
        toast.error("Gagal memuat pratinjau PDF.");
        setPdfLoading(false);
    }, []);

    // Traditional click handler (non-canvas mode)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isCanvasMode || !pageRef.current) return;
        
        const rect = pageRef.current.getBoundingClientRect();
        if (!rect) return;

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const relativeX = clickX / rect.width;
        const relativeY = clickY / rect.height;

        const pdfX = Math.round(relativeX * originalPageWidth);
        const pdfY = Math.round(relativeY * (originalPageWidth * 1.414));

        let updatedFields = [...signatureFieldsLocal];
        let targetCategory: "Petugas" | "Penerima" | null = null;

        if (!updatedFields.some(f => f.category === "Petugas")) {
            targetCategory = "Petugas";
        } else if (!updatedFields.some(f => f.category === "Penerima")) {
            targetCategory = "Penerima";
        }

        if (targetCategory) {
            updatedFields = updatedFields.filter(f => f.category !== targetCategory);
            updatedFields.push({
                category: targetCategory,
                pos_x: pdfX,
                pos_y: pdfY,
                page_signature: currentPage
            });

            setSignatureFieldsLocal(updatedFields);
            onSignatureFieldsChange(updatedFields);
            
            toast.success(`Posisi ${targetCategory} berhasil ditentukan pada halaman ${currentPage}.`);
        } else {
            toast.warning("Anda sudah menentukan kedua posisi (Petugas dan Penerima).");
        }
    };

    const handleReset = () => {
        setSignatureFieldsLocal([]);
        onSignatureFieldsChange([]);
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.clear();
        }
        toast.info("Semua posisi tanda tangan telah direset.");
    };

    const handleSubmit = async () => {
        if (!token || !doc.id) {
            toast.error("Token atau ID dokumen tidak tersedia.");
            return;
        }
        if (signatureFieldsLocal.length < 2) {
            toast.warning("Silakan tambahkan 2 posisi tanda tangan sebelum menyimpan.");
            return;
        }

        try {
            await updateDocWithSignatures(doc.id.toString(), signatureFieldsLocal, token);
            toast.success("Tanda tangan berhasil disimpan.");
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error("Gagal menyimpan posisi tanda tangan:", error);
            toast.error("Gagal menyimpan posisi tanda tangan.");
        }
    };

    const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(numPages, prev + 1));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Letakkan Tanda Tangan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isCanvasMode 
                            ? "Gunakan tools di bawah untuk menambahkan elemen ke PDF." 
                            : "Klik pada area PDF untuk menentukan posisi tanda tangan."
                        }
                    </p>
                </div>
                
                <button
                    onClick={toggleCanvasMode}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isCanvasMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                    {isCanvasMode ? 'Mode Canvas (Aktif)' : 'Mode Tradisional'}
                </button>
            </div>

            {/* Canvas Mode Tools */}
            {isCanvasMode && (
                <div className="flex gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setSelectedTool('signature')}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedTool === 'signature'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        📝 Tanda Tangan
                    </button>
                    <button
                        onClick={() => setSelectedTool('text')}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedTool === 'text'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        📄 Teks
                    </button>
                    <button
                        onClick={() => setSelectedTool('rectangle')}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedTool === 'rectangle'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        ▭ Kotak
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
                    >
                        🗑️ Hapus Semua
                    </button>
                </div>
            )}

            {/* PDF Viewer with Canvas Overlay */}
            <div
                ref={pdfContainerRef}
                className="relative w-full max-w-4xl mx-auto border border-gray-300 dark:border-gray-600 rounded overflow-hidden"
                style={{ minHeight: '500px' }}
            >
                {pdfLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <LoadingSpinner message="Memuat pratinjau PDF..." />
                    </div>
                )}

                {doc.example_file ? (
                    <div className="relative">
                        <Document
                            file={doc.example_file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading=""
                        >
                            <div 
                                ref={pageRef}
                                className={`relative ${!isCanvasMode ? 'cursor-crosshair' : ''}`}
                                onClick={!isCanvasMode ? handleClick : undefined}
                            >
                                <Page
                                    pageNumber={currentPage}
                                    width={containerWidth}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    onLoadSuccess={onPageLoadSuccess}
                                />

                                {/* Canvas overlay for Fabric.js */}
                                {isCanvasMode && (
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 z-10"
                                        style={{
                                            width: containerWidth,
                                            height: containerWidth * 1.414,
                                        }}
                                    />
                                )}

                                {/* Traditional signature indicators */}
                                {!isCanvasMode && signatureFieldsLocal.map((field, index) => (
                                    field.page_signature === currentPage && (
                                        <div
                                            key={`${field.category}-${index}`}
                                            className={`absolute flex items-center space-x-1 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg z-10 transition-all duration-200 ${
                                                field.category === "Petugas" ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                                            }`}
                                            style={{
                                                left: `${(field.pos_x / originalPageWidth) * containerWidth}px`,
                                                top: `${(field.pos_y / (originalPageWidth * 1.414)) * (containerWidth * 1.414)}px`,
                                                transform: 'translate(-50%, -50%)',
                                                cursor: 'pointer'
                                            }}
                                            title={`${field.category} - Klik untuk menghapus`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const updatedFields = signatureFieldsLocal.filter(f => f.category !== field.category);
                                                setSignatureFieldsLocal(updatedFields);
                                                onSignatureFieldsChange(updatedFields);
                                                toast.info(`Posisi ${field.category} telah dihapus.`);
                                            }}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                            <span>{field.category}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </Document>
                    </div>
                ) : (
                    !pdfLoading && (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            Tidak ada file PDF untuk ditampilkan.
                        </div>
                    )
                )}
            </div>

            {/* Pagination Controls */}
            {numPages > 0 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Sebelumnya
                    </button>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Halaman {currentPage} dari {numPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Berikutnya
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={signatureFieldsLocal.length < 2}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                        signatureFieldsLocal.length >= 2
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Simpan Posisi ({signatureFieldsLocal.length}/2)
                </button>
                {!isCanvasMode && (
                    <button
                        onClick={handleReset}
                        className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Status indicator */}
            {signatureFieldsLocal.length > 0 && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {signatureFieldsLocal.map(field => (
                        <span key={field.category} className="inline-block mx-2">
                            ✅ {field.category} (Hal. {field.page_signature})
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// Utility function for debouncing resize events
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