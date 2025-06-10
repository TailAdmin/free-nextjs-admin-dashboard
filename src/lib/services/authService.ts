import apiClient from "@/lib/axiosConfig";
import { ChangePasswordPayload, ChangePasswordResponse, ForgotPasswordPayload, ForgotPasswordResponse, User } from "@/types/user.types";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import axios from "axios";

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

export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    try {

        const response = await apiClient.post<ChangePasswordResponse>('/auth/password/change/', payload);
        
        return response.data; 
    } catch (error: any) { 
        console.error("Gagal mengubah kata sandi via Axios:", error);

        let errorMessage = "Terjadi kesalahan saat mengubah kata sandi.";
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.data && typeof error.response.data === 'object') {
                if ('detail' in error.response.data && typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                } else if ('new_password' in error.response.data && Array.isArray(error.response.data.new_password) && error.response.data.new_password.length > 0) {
                    errorMessage = error.response.data.new_password[0];
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else {
                errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = "Tidak ada respons dari server. Periksa koneksi Anda.";
        } else {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    try {
        const response = await apiClient.post<ForgotPasswordResponse>('/auth/password/forgot/', payload);
        return response.data;
    } catch (error: any) {
        console.error("Gagal mengirim permintaan reset password:", error);
        let errorMessage = "Terjadi kesalahan saat mengirim permintaan reset password.";
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.data && typeof error.response.data === 'object') {
                if ('detail' in error.response.data && typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else {
                errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = "Tidak ada respons dari server. Periksa koneksi Anda.";
        } else {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};