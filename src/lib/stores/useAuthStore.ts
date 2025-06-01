import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { User } from "@/types/user.types";
import { DocTemplateResponse } from "@/types/pdfTemplate.types";

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    templates: DocTemplateResponse[]; 

    setToken: (token: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    setUser: (user: User) => void;
    setTemplates: (templates: DocTemplateResponse[]) => void; 
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                templates: [],

                setToken: (token) => set({ token }),
                setRefreshToken: (refreshToken) => set({ refreshToken }),
                setUser: (user) => set({ user, isAuthenticated: true }),

                setTemplates: (templates) => set({ templates }),

                logout: () =>
                    set({
                        token: null,
                        refreshToken: null,
                        user: null,
                        isAuthenticated: false,
                        templates: [],
                    }),
            }),
            {
                name: "auth-storage",
            }
        )
    )
);