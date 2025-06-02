import { SignatureResponse } from "@/types/signature.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const saveUserSignature = async (
    payload: FormData,
    token: string
): Promise<SignatureResponse> => {
    const response = await fetch(`${API_URL}/signatures/user/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: payload,
    });

    if (!response.ok) {
        throw new Error("Gagal menyimpan tanda tangan");
    }

    return await response.json();
};