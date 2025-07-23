import { DocTemplatePayload, SignatureField, SignerDelegation } from "@/types/pdfTemplate.types";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";
import apiClient from "../axiosConfig";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadPdfTemplate = async (
    payload: Omit<DocTemplatePayload, 'example_file'>,
    token: string,
    fileToUpload: File //
): Promise<DocTemplateResponse> => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("version", payload.version);
    formData.append("created_by", payload.created_by.toString());

    formData.append("example_file", fileToUpload);

    if (payload.signature_fields && payload.signature_fields.length > 0) {
        formData.append("signature_fields", JSON.stringify(payload.signature_fields));
    }

    const response = await apiClient.post("/signatures/doc-templates/", formData)


    // if (!response.ok) {
    //     const errorText = await response.text();
    //     console.error("Raw error response:", errorText);
    //     try {
    //         const errorJson = JSON.parse(errorText);
    //         console.error("Parsed error response:", errorJson);
    //         throw new Error(`Gagal mengupload dokumen: ${errorJson.detail || JSON.stringify(errorJson)}`);
    //     } catch (e) {
    //         throw new Error(`Gagal mengupload dokumen. Status: ${response.status}. Pesan: ${errorText}`);
    //     }
    // }

    return await response.data
};

export const fetchAllPdfTemplates = async (token: string): Promise<DocTemplateResponse[]> => {
    try {

        const response = await apiClient.get(`/signatures/doc-templates/short-list/`)
        
        console.log(response)
        // if (!response.ok) {
        //     const errorData = await response.json();
        //     console.error("Error fetching templates short-list:", errorData);
        //     throw new Error(errorData.detail || `Gagal mengambil dokumen. Status: ${response.status}`);
        // }
        const data = await response.data
        console.log("Data templates (short-list) dari API:", data);
        return data;
    } catch (error: any) {
        console.error("Kesalahan dalam fetchAllPdfTemplates (short-list):", error);
        throw new Error(`Terjadi kesalahan saat memuat dokumen: ${error.message || 'Unknown error'}`);
    }
};

export const fetchDocById = async (id: string, token: string): Promise<DocTemplateResponse> => {
    // Validasi ID yang lebih sederhana, karena ini UUID string
    if (!id || typeof id !== 'string') {
        console.error(`Kesalahan: ID dokumen tidak valid atau bukan string: "${id}"`);
        throw new Error(`ID dokumen tidak valid untuk diambil: ${id}`);
    }

    const response = await fetch(`${API_URL}/signatures/doc-templates/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let errorDetail = `Gagal mengambil dokumen ID: ${id}`;
        try {
            const errorJson = await response.json();
            errorDetail = errorJson.detail || errorDetail;
        } catch (e) {
            const errorText = await response.text();
            errorDetail = errorText || errorDetail;
        }
        console.error("Error fetching doc:", response.status, errorDetail);
        throw new Error(errorDetail);
    }

    return await response.json();
};

export const updateDocWithSignatures = async (
    id: string,
    signatureFields: SignatureField[],
    token: string
): Promise<DocTemplateResponse> => {
    const response = await fetch(`${API_URL}/signatures/doc-templates/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ signature_fields: signatureFields }),
    });

    if (!response.ok) {
        throw new Error("Gagal memperbarui dokumen");
    }

    return await response.json();
};

export const deletePdfTemplate = async (id: string, token: string): Promise<void> => { 
    // Validasi sederhana untuk memastikan ID tidak kosong atau bukan string
    if (!id || typeof id !== 'string') {
        console.error(`Kesalahan: ID dokumen tidak valid untuk dihapus: "${id}"`);
        throw new Error(`ID dokumen tidak valid untuk dihapus: ${id}`);
    }

    const response = await fetch(`${API_URL}/signatures/doc-templates/${id}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let errorDetail = `Gagal menghapus dokumen ID: ${id}`;
        try {
            const errorJson = await response.json();
            errorDetail = errorJson.detail || errorDetail;
        } catch (e) {
            const errorText = await response.text();
            errorDetail = errorText || errorDetail;
        }
        console.error("Error delete:", response.status, errorDetail);
        throw new Error(errorDetail);
    }
};

export async function fetchSignerDelegations(token: string): Promise<SignerDelegation[]> {
    const response = await fetch(`${API_URL}/signatures/user/delegations/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal mengambil daftar penandatangan");
    }

    const data: SignerDelegation[] = await response.json();
    return data;
}