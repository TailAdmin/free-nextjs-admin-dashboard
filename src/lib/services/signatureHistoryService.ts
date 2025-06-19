// src/lib/services/signatureHistoryService.ts
import { SignatureHistoryResponse } from "@/types/signatureHistory.types"; 

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSignatureHistory = async (token: string): Promise<SignatureHistoryResponse[]> => {
    try {
        if (!API_URL) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
        }

        const res = await fetch(`${API_URL}/signatures/history/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || `Gagal mengambil histori tanda tangan. Status: ${res.status}`);
        }

        return await res.json();
    } catch (error: any) {
        console.error("Error fetching signature history:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mengambil histori tanda tangan.");
    }
};