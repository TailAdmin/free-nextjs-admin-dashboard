import { useCallback, useState } from "react";

export const useSaveData =( endpoint: string) => {
    const [isSaving, setIsSaving] = useState(true);
    const [errorSaving, setError] = useState<string | null>(null);

    const saveData = useCallback(async (dataId: string, data: Record<string, any> = {}) => {
        setIsSaving(true);
        setError(null);
        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({dataId, data} ),
            });
            const { success, message } = await response.json(); 
            if (!success) {
                throw new Error(message);
            }

        } catch (err) {
            setError(`${err}`);
        } finally {
            setIsSaving(false);
        }
    }, [endpoint]);

    return {isSaving, errorSaving, saveData };
};