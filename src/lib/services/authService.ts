// src/lib/services/authService.ts
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
    // Menambahkan properti _isLoginRequest ke konfigurasi permintaan
    const response = await apiClient.post("/auth/login/", {
        username,
        password,
    }, {
        _isLoginRequest: true // Properti ini kini dikenal oleh TypeScript
    });

    const data = response.data;

    const { setToken, setRefreshToken } = useAuthStore.getState();
    setToken(data.access);
    setRefreshToken(data.refresh);
    console.log("login");
    console.log(data.access, data.refresh);
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

    // Pastikan respons dari refreshAccessToken mengembalikan properti 'access'
    // yang diharapkan oleh interceptor (destructuring { access: newToken })
    return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    try {
        const response = await apiClient.post<ChangePasswordResponse>('/auth/password/change/', payload);
        return response.data;
    } catch (error: any) {
        console.error("Gagal mengubah kata sandi via Axios:", error);

        let errorMessage = "Terjadi kesalahan yang tidak diketahui."; 

        if (axios.isAxiosError(error) && error.response) {
            const responseData = error.response.data;

            if (responseData && typeof responseData === 'object') {
                if ('detail' in responseData && typeof responseData.detail === 'string') {
                    errorMessage = responseData.detail;
                }
                else if ('old_password' in responseData && Array.isArray(responseData.old_password) && responseData.old_password.length > 0) {
                    errorMessage = `Kata Sandi Lama: ${responseData.old_password[0]}`;
                }
                else if ('new_password' in responseData && Array.isArray(responseData.new_password) && responseData.new_password.length > 0) {
                    errorMessage = `Kata Sandi Baru: ${responseData.new_password[0]}`;
                }
                else if ('error' in responseData && typeof responseData.error === 'string') {
                    errorMessage = responseData.error; 
                }
                else if (Object.keys(responseData).length > 0) {
                    errorMessage = Object.values(responseData)[0] as string;
                }
            } else if (typeof responseData === 'string') {
                errorMessage = responseData;
            } else {
                errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
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


export type UpdateUserProfilePayload = {
    first_name?: string;
    last_name?: string;
    email?: string;
    // Jika Anda ingin mengizinkan update foto profil, tambahkan ini:
    profile?: {
        photo?: string; // Atau tipe file jika Anda langsung mengupload file
    };
};

export const updateUserProfile = async (payload: FormData): Promise<User> => {
    const response = await apiClient.patch<User>('/user/', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};