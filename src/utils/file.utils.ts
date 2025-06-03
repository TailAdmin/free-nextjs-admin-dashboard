export const canvasToFile = async (
    canvas: HTMLCanvasElement,
    filename: string = "signature.jpg"
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        if (!ctx) {
            reject(new Error("Context 2D tidak tersedia"));
            return;
        }

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        tempCanvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Gagal membuat blob dari canvas"));
                return;
            }
            const file = new File([blob], filename, { type: "image/jpeg" });
            resolve(file);
        }, "image/jpeg", 0.95);
    });
};
