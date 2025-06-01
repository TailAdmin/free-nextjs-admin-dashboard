import { create } from "zustand";

interface SignatureState {
    signature: string | null;
    setSignature: (file: string | null) => void;
    clearSignature: () => void;
}

export const useSignatureStore = create<SignatureState>((set) => ({
    signature: null,
    setSignature: (file) => set({ signature: file }),
    clearSignature: () => set({ signature: null }),
}));