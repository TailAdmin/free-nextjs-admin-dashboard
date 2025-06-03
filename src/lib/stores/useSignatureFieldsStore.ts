import { create } from "zustand";

interface SignatureField {
    category: string;
    pos_x: number;
    pos_y: number;
}

interface SignatureFieldState {
    signatureFields: SignatureField[];
    setSignatureFields: (fields: SignatureField[]) => void;
    clearSignatureFields: () => void;
}

export const useSignatureFieldStore = create<SignatureFieldState>((set) => ({
    signatureFields: [],
    setSignatureFields: (fields) => set({ signatureFields: fields }),
    clearSignatureFields: () => set({ signatureFields: [] }),
}));