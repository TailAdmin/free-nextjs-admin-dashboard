// src/lib/services/signatureHistoryService.ts
import { SignatureHistoryApiResponse } from "@/types/signatureHistory.types";
import apiClient from "../axiosConfig";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getSignatureHistory = async () : Promise<SignatureHistoryApiResponse[]> => await apiClient.get('/signatures/history/').then(res=>res.data)

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

export const deleteSignatureHistory = async (id:string) :  Promise<void> => await apiClient.get(`${API_URL}/signatures/history/${id}/`).then(res=>res.data) 