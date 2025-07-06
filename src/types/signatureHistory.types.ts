// src/lib/services/signatureHistoryService.ts
// Sesuaikan agar tipe respons sesuai dengan data API Anda
export interface SignatureHistoryApiResponse {
    id: string;
    template: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    version: string;
}