import { DocTemplatePayload, SignatureField } from "@/types/pdfTemplate.types";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadPdfTemplate = async (
    payload: DocTemplatePayload,
    token: string
): Promise<DocTemplateResponse> => {
    const formData = new FormData();

    const byteString = atob(payload.example_file.split(",")[1] || payload.example_file);
    const mimeString = payload.example_file
        .split(",")[0]
        .replace("data:", "")
        .replace(";base64", "");

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], payload.name, { type: mimeString });

    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("version", payload.version);
    formData.append("created_by", payload.created_by.toString());
    formData.append("example_file", file);

    const response = await fetch(`${API_URL}/signatures/doc-templates/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        throw new Error(`Gagal mengupload dokumen. Status: ${response.status}`);
    }

    return await response.json();
};

export const fetchAllPdfTemplates = async (token: string): Promise<DocTemplateResponse[]> => {
    try {
        // Menggunakan endpoint /short-list/
        const response = await fetch(`${API_URL}/signatures/doc-templates/short-list/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching templates short-list:", errorData);
            throw new Error(errorData.detail || `Gagal mengambil dokumen. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data templates (short-list) dari API:", data);
        return data;
    } catch (error: any) {
        console.error("Kesalahan dalam fetchAllPdfTemplates (short-list):", error);
        throw new Error(`Terjadi kesalahan saat memuat dokumen: ${error.message || 'Unknown error'}`);
    }
};

export const fetchDocById = async (id: string, token: string): Promise<DocTemplateResponse> => {
    const response = await fetch(`${API_URL}/signatures/doc-templates/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching doc:", errorText);
        throw new Error(`Gagal mengambil dokumen ID: ${id}`);
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

export const deletePdfTemplate = async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/signatures/doc-templates/${id}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error delete:", errorText);
        throw new Error(`Gagal menghapus dokumen ID: ${id}`);
    }
};
