// src/lib/stores/useDocumentStore.ts

import { create } from "zustand";
import {
    fetchAllPdfTemplates, // Ini akan memanggil fungsi yang sudah diupdate
    deletePdfTemplate,
} from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";
import { devtools } from "zustand/middleware";

interface DocumentState {
    templates: DocTemplateResponse[];
    loading: boolean;
    error: string | null;
    fetchTemplates: (token: string, force?: boolean) => Promise<void>;
    deleteTemplate: (id: number, token: string) => Promise<void>;
    setTemplates: (templates: DocTemplateResponse[]) => void;
}

export const useDocumentStore = create<DocumentState>()(
    devtools(
        (set, get) => ({
            templates: [],
            loading: false,
            error: null,

            fetchTemplates: async (token, force = false) => {
                if (!force && get().templates.length > 0) {
                    console.log("Templates sudah ada, tidak perlu fetch ulang.");
                    return;
                }

                set({ loading: true, error: null });
                try {
                    // Ini akan memanggil fetchAllPdfTemplates yang sudah diupdate
                    const data = await fetchAllPdfTemplates(token); 
                    set({ templates: data, loading: false });
                } catch (err: any) {
                    console.error("Kesalahan saat memuat dokumen:", err);
                    set({ error: err.message || "Gagal memuat dokumen.", loading: false });
                }
            },

            deleteTemplate: async (id, token) => {
                set({ loading: true, error: null });
                try {
                    await deletePdfTemplate(id, token);
                    set((state) => ({
                        templates: state.templates.filter((doc) => doc.id !== id),
                        loading: false,
                    }));
                } catch (err: any) {
                    console.error("Kesalahan saat menghapus dokumen:", err);
                    set({ error: err.message || "Gagal menghapus dokumen.", loading: false });
                }
            },

            setTemplates: (templates) => set({ templates }),
        }),
        {
            name: "document-storage",
        }
    )
);