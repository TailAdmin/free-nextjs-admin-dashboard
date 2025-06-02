// src/hooks/useProtectedRoute.ts
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export const useProtectedRoute = () => {
    const router = useRouter();
    const { isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated && !token) {
            router.push("/signin");
        }
    }, [isAuthenticated, token, router]);

    return { isAuthenticated, token };
};