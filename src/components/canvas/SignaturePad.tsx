"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import SignaturePad from 'signature_pad';
import { toast } from 'sonner';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    clearButtonLabel?: string;
    saveButtonLabel?: string;
}

export default function CustomSignaturePad({ onSave, clearButtonLabel = "Bersihkan", saveButtonLabel = "Selesai" }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

    const resizeCanvas = useCallback(() => {
        if (canvasRef.current && containerRef.current) {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            
            const availableWidth = container.offsetWidth;
            const aspectRatio = 400 / 200; 
            let newWidth = availableWidth;
            let newHeight = availableWidth / aspectRatio; 

            if (newHeight < 150) { 
                newHeight = 150;
                newWidth = newHeight * aspectRatio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            setCanvasDimensions({ width: newWidth, height: newHeight });

            if (signaturePadRef.current) {
                signaturePadRef.current.clear(); 
            }
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current && containerRef.current) {
            const canvas = canvasRef.current;

            resizeCanvas(); 

            const newSignaturePad = new SignaturePad(canvas, {
                backgroundColor: 'rgba(0, 0, 0, 0)', 
                penColor: 'rgb(0, 0, 0)', 
                minWidth: 1,
                maxWidth: 2.5,
                dotSize: 1,
            });

            signaturePadRef.current = newSignaturePad;

            const handleBeginStroke = () => {
                setIsEmpty(false);
            };

            const handleEndStroke = () => {
                setIsEmpty(newSignaturePad.isEmpty());
            };

            newSignaturePad.addEventListener("beginStroke", handleBeginStroke);
            newSignaturePad.addEventListener("endStroke", handleEndStroke);

            window.addEventListener('resize', resizeCanvas);

            return () => {
                if (signaturePadRef.current) {
                    signaturePadRef.current.removeEventListener("beginStroke", handleBeginStroke);
                    signaturePadRef.current.removeEventListener("endStroke", handleEndStroke);
                    signaturePadRef.current.off();
                }
                window.removeEventListener('resize', resizeCanvas);
            };
        }
    }, [resizeCanvas]);

    const handleClear = useCallback(() => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
            setIsEmpty(true);
        }
    }, []);

    const handleSave = useCallback(() => {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            const dataUrl = signaturePadRef.current.toDataURL('image/png');
            onSave(dataUrl);
        } else {
            toast.warning("Harap tanda tangan terlebih dahulu.");
        }
    }, [onSave]);

    return (
        <div className="flex flex-col items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Tanda Tangan Anda</h4>
            <div ref={containerRef} className="border border-gray-400 dark:border-gray-600 rounded-md overflow-hidden bg-white dark:bg-gray-700 w-full" style={{ maxWidth: '100%' }}>
                <canvas
                    ref={canvasRef}
                    className="signature-canvas w-full h-auto"
                    style={{
                        display: 'block',
                    }}
                />
            </div>
            <div className="mt-4 flex space-x-2">
                <button
                    onClick={handleClear}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
                >
                    {clearButtonLabel}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isEmpty}
                    className={`px-4 py-2 rounded-md transition-colors ${isEmpty ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    {saveButtonLabel}
                </button>
            </div>
        </div>
    );
}