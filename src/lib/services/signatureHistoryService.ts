// src/lib/services/signatureHistoryService.ts
import { SignatureHistoryApiResponse } from "@/types/signatureHistory.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSignatureHistory = async (token: string): Promise<SignatureHistoryApiResponse[]> => {
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

export const deleteSignatureHistory = async (id: string, token: string): Promise<void> => {
    try {
        if (!API_URL) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
        }

        const res = await fetch(`${API_URL}/signatures/history/${id}/`, {
            method: 'DELETE', // Menggunakan metode DELETE
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            // Jika status 204 No Content, berarti berhasil dihapus tanpa respons body
            if (res.status === 204) {
                return;
            }
            throw new Error(errorData.detail || `Gagal menghapus histori tanda tangan. Status: ${res.status}`);
        }

        return; // Mengembalikan void karena tidak ada data yang diharapkan setelah DELETE berhasil
    } catch (error: any) {
        console.error(`Error deleting signature history with ID ${id}:`, error);
        throw new Error(error.message || "Terjadi kesalahan saat menghapus histori tanda tangan.");
    }
};