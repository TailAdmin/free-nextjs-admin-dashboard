import { create } from "zustand";
import {
    fetchAllPdfTemplates,
    deletePdfTemplate,
} from "@/lib/services/pdfTemplateService";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";

interface DocumentState {
    templates: DocTemplateResponse[] | null;
    loading: boolean;
    error: string | null;
    fetchTemplates: (token: string) => Promise<void>;
    deleteTemplate: (id: number, token: string) => Promise<void>;
    setTemplates: (templates: DocTemplateResponse[]) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    templates: null,
    loading: false,
    error: null,

    fetchTemplates: async (token) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchAllPdfTemplates(token);
            set({ templates: data, loading: false });
        } catch (err) {
            set({ error: `Gagal memuat dokumen ${err}}`, loading: false });
        }
    },

    deleteTemplate: async (id, token) => {
        set({ loading: true, error: null });
        try {
            await deletePdfTemplate(id, token);
            set((state) => ({
                templates: state.templates?.filter((doc) => doc.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: `Gagal memuat dokumen ${err}}`, loading: false });
        }
    },

    setTemplates: (templates) => set({ templates }), 
}));