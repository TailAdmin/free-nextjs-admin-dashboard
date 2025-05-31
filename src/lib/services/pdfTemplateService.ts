import { DocTemplatePayload } from "@/types/pdfTemplate.types";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadPdfTemplate = async (
    payload: DocTemplatePayload,
    token: string
): Promise<DocTemplateResponse> => {
    const formData = new FormData();

    // Asumsi 'payload.example_file' adalah base64
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

    // Append field ke FormData
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