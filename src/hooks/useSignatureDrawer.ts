import React, { useRef, useState, useEffect } from "react";

interface UseSignatureDrawerProps {
    onDrawEnd?: (dataUrl: string | null) => void; 
}

export const useSignatureDrawer = ({ onDrawEnd }: UseSignatureDrawerProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {

                ctx.strokeStyle = "#000"; 
                ctx.lineWidth = 2; 
                ctx.lineCap = "round";
                ctx.lineJoin = "round"; 
            }
        }
    }, []); 

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
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const dataUrl = canvasRef.current?.toDataURL('image/png') || "";
        if (onDrawEnd) onDrawEnd(dataUrl);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
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
