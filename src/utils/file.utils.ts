export const canvasToFile = async (
    canvas: HTMLCanvasElement,
    filename: string = "signature.jpg"
): Promise<File> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Gagal membuat blob dari canvas"));
                return;
            }
            const file = new File([blob], filename, { type: "image/jpeg" });
            resolve(file);
        }, "image/jpeg", 0.95);
    });
};