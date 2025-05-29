import { DocTemplatePayload, DocTemplateResponse } from "@/types/pdfTemplate.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadPdfTemplate = async (
    payload: DocTemplatePayload,
    token: string
): Promise<DocTemplateResponse> => {
    const response = await fetch(`${API_URL}/signatures/doc-templates/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengupload dokumen");
    }

    return await response.json();
};