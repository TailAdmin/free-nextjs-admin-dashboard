import apiClient from "@/lib/axiosConfig";
import { User } from "@/types/user.types";
import { useAuthStore } from "../stores/useAuthStore";

export type LoginResponse = {
    access: string;
    refresh: string;
};

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login/", {
        username,
        password,
    });

    const data = response.data;

    const { setToken, setRefreshToken } = useAuthStore.getState();
    setToken(data.access);
    setRefreshToken(data.refresh);

    return data;
};

export const fetchUserData = async (): Promise<User> => {
    const response = await apiClient.get("/user/");
    return response.data;
};

export const refreshAccessToken = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
        throw new Error("Refresh token tidak tersedia");
    }

    const response = await apiClient.post("/auth/token/refresh/", {
        refresh: refreshToken,
    });

    return response.data;
};