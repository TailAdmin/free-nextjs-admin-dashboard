// src/lib/axiosConfig.ts
import axios from "axios";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { refreshAccessToken } from "@/lib/services/authService";

interface FailedRequest {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

apiClient.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jika ini adalah permintaan login yang gagal dengan 403 dan ditandai sebagai _isLoginRequest,
        // langsung tolak promise agar error bisa ditangkap di form login.
        if (error?.response?.status === 403 && originalRequest._isLoginRequest) {
            return Promise.reject(error);
        }

        // Logika refresh token untuk permintaan non-login
        if (
            error?.response?.status === 403 &&
            !originalRequest._retry // Mencegah loop tak terbatas
        ) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const { access: newToken } = await refreshAccessToken();
                    useAuthStore.getState().setToken(newToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    originalRequest._retry = true;

                    // Lanjutkan semua permintaan yang tertunda dengan token baru
                    failedRequestsQueue.forEach(({ resolve }) => resolve(newToken));
                    failedRequestsQueue = [];
                    isRefreshing = false;

                    // Ulangi permintaan asli dengan token baru
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error("Gagal refresh token:", refreshError);
                    // Jika refresh token gagal, paksa logout dan redirect ke halaman signin
                    useAuthStore.getState().logout();
                    window.location.href = "/signin";
                    return Promise.reject(refreshError);
                }
            }

            // Antrekan permintaan yang gagal jika sudah ada proses refresh yang berjalan
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        // Penanganan untuk status 403 lainnya (misalnya token tidak valid setelah refresh)
        // atau jika API mengembalikan kode error spesifik untuk token yang tidak valid
        if (
            error?.response?.status === 403 &&
            (error?.response?.data?.code === "user_inactive" ||
            error?.response?.data?.code === "token_not_valid")
        ) {
            useAuthStore.getState().logout();
            window.location.href = "/signin";
        }

        // Untuk semua error lainnya, tolak promise
        return Promise.reject(error);
    }
);

export default apiClient;
