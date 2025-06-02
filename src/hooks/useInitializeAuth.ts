import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { refreshAccessToken, fetchUserData } from "@/lib/services/authService";

export const useInitializeAuth = () => {
    const { token, refreshToken, isAuthenticated, setUser } = useAuthStore();

    useEffect(() => {
        const initialize = async () => {
            if (!token && refreshToken) {
                try {
                    const { access } = await refreshAccessToken();
                    const userData = await fetchUserData();
                    useAuthStore.getState().setToken(access);
                    setUser(userData);
                } catch (e) {
                    console.log(e)
                    console.warn("Auto-login gagal");
                }
            }
        };

        initialize();
    }, [token]);

    return { isAuthenticated, token };
};