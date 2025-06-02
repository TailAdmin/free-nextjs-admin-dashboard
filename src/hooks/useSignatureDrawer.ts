import React, { useRef, useState } from "react";

interface UseSignatureDrawerProps {
    onDrawEnd?: (dataUrl: string | null) => void; 
}

export const useSignatureDrawer = ({ onDrawEnd }: UseSignatureDrawerProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const coords = getCoordinates(e);
        if (!coords || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const coords = getCoordinates(e);
        if (!coords) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const dataUrl = canvasRef.current?.toDataURL() || "";
        if (onDrawEnd) onDrawEnd(dataUrl);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
        if (onDrawEnd) {
            onDrawEnd(null);
        }
    };

    const getCoordinates = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        let clientX = 0;
        let clientY = 0;

        if ("touches" in e) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            clientX = touch.clientX - rect.left;
            clientY = touch.clientY - rect.top;
        } else {
            clientX = e.nativeEvent.offsetX;
            clientY = e.nativeEvent.offsetY;
        }

        return { x: clientX, y: clientY };
    };

    return {
        canvasRef,
        startDrawing,
        draw,
        endDrawing,
        clearCanvas,
    };
};