import { useState, useEffect } from "react";
import { getUserSignature, saveUserSignature } from "@/lib/services/signatureService";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export function useProfileData() {
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { token, user } = useAuthStore();
    const userId = user?.id;

    const fetchSignature = async () => {
        if (!userId || !token) return;

        setLoading(true);
        try {
            const signatureData = await getUserSignature(userId, token);
            setSignatureImage(signatureData.file);
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err: unknown) => {
        if (err instanceof Error) {
            setError(err);
            console.error("Gagal memuat tanda tangan:", err.message);
        } else {
            const error = new Error("Unknown error occurred");
            setError(error);
            console.error("Gagal memuat tanda tangan:", error.message);
        }
    };

    const uploadSignature = async (file: File) => {
        if (!userId || !token) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            await saveUserSignature(formData, token);
            await fetchSignature(); 
        } catch (err: unknown) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchSignature();
    }, [userId, token]);

    return {
        signatureImage,
        loading,
        error,
        refetchSignature: fetchSignature,
        uploadSignature,
    };
}