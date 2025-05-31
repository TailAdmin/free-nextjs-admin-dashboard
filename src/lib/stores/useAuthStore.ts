import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { User } from "@/types/user.types";

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;

    setToken: (token: string) => void;
    setRefreshToken: (refreshToken: string) => void; 
    setUser: (user: User) => void;
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

                setToken: (token) => set({ token }),
                setRefreshToken: (refreshToken) => set({ refreshToken }), 
                setUser: (user) => set({ user, isAuthenticated: true }),

                logout: () =>
                    set({
                        token: null,
                        refreshToken: null,
                        user: null,
                        isAuthenticated: false,
                    }),
            }),
            {
                name: "auth-storage",
            }
        )
    )
);