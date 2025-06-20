import { GetSessionDetailsResponse, ClientSignaturePayload, ClientSignResponse } from "@/types/signatureProcess.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.");
}

export const getSessionDetails = async (sessionId: string): Promise<GetSessionDetailsResponse> => {
    try {
        const requestUrl = `${API_BASE_URL}/signatures/process/start/${sessionId}`;

        const response = await fetch(requestUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(">>> Gagal mendapatkan detail sesi, status:", response.status, "data:", errorData);
            throw new Error(errorData.detail || `Gagal mengambil detail sesi: ${response.statusText}`);
        }

        const rawText = await response.text();
        console.log(">>> Raw Response Text dari API:", rawText); 

        const data: GetSessionDetailsResponse = JSON.parse(rawText);

        console.log(">>> Berhasil mendapatkan detail sesi (Parsed Data):", data);
        console.log(">>> Berhasil mendapatkan detail sesi (Parsed Data - JSON stringify):", JSON.stringify(data));

        return data; 
    } catch (error) {
        console.error("Error di getSessionDetails:", error);
        throw error;
    }
};



export async function getSignatureImage(signatureId: string, token: string): Promise<string> {
    try {
        const urlResponse = await fetch(`${API_BASE_URL}/signatures/user/${signatureId}/image/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            },
        });

        if (!urlResponse.ok) {
            const errorData = await urlResponse.json();
            console.error("[getSignatureImage] Gagal mendapatkan URL gambar tanda tangan dari API:", errorData);
            throw new Error(errorData.detail || `Gagal mengambil URL gambar tanda tangan: ${urlResponse.status}`);
        }

        const data: { image_url: string } = await urlResponse.json();
        const directImageUrl = data.image_url;

        if (!directImageUrl) {
            console.error("[getSignatureImage] URL gambar tanda tangan tidak ditemukan dalam respons API.");
            throw new Error("URL gambar tanda tangan tidak ditemukan dalam respons API.");
        }

        const imageResponse = await fetch(directImageUrl);
        if (!imageResponse.ok) {
            console.error(`[getSignatureImage] Gagal mengunduh gambar dari URL langsung: ${directImageUrl}. Status: ${imageResponse.status}, Text: ${imageResponse.statusText}`);
            throw new Error(`Gagal mengunduh gambar dari ${directImageUrl}: ${imageResponse.statusText}`);
        }

        const imageBlob = await imageResponse.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return reject(new Error("Gagal mendapatkan konteks 2D dari kanvas."));
                    }
                    ctx.drawImage(img, 0, 0);

                    try {
                        const pngDataUrl = canvas.toDataURL('image/png');
                        console.log(`[getSignatureImage] Data URL PNG berhasil dibuat. Dimulai dengan: ${pngDataUrl.substring(0, 50)}...`);
                        resolve(pngDataUrl);
                    } catch (e) {
                        console.error(`[getSignatureImage] Gagal mengonversi gambar ke Data URL PNG: ${e}`);
                        reject(new Error(`Gagal mengonversi gambar ke Data URL PNG: ${e}`));
                    }
                };
                img.onerror = (e) => {
                    console.error(`[getSignatureImage] Gagal memuat gambar ke elemen Image untuk konversi: ${e}`);
                    reject(new Error(`Gagal memuat gambar ke elemen Image untuk konversi: ${e}`));
                };
                img.src = reader.result as string; 
            };
            reader.onerror = (e) => {
                console.error(`[getSignatureImage] FileReader error saat membaca blob: ${e}`);
                reject(new Error(`FileReader error saat membaca blob: ${e}`));
            };
            reader.readAsDataURL(imageBlob);
        });

    } catch (error) {
        console.error("Error dalam proses getSignatureImage keseluruhan:", error);
        throw error;
    }
};