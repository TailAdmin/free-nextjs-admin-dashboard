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

        if (
            error?.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await refreshAccessToken(); 
                    useAuthStore.getState().setToken(newToken); 
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    originalRequest._retry = true; 

                    failedRequestsQueue.forEach(({ resolve }) => resolve(newToken));
                    failedRequestsQueue = [];
                    isRefreshing = false;

                    return apiClient(originalRequest); 
                } catch (refreshError) {
                    console.error("Gagal refresh token:", refreshError);
                    useAuthStore.getState().logout();
                    window.location.href = "/signin"; 
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        if (
            error?.response?.status === 401 &&
            error?.response?.data?.code === "user_inactive" ||
            error?.response?.data?.code === "token_not_valid"
        ) {
            useAuthStore.getState().logout();
            window.location.href = "/signin";
        }

        return Promise.reject(error);
    }
);

export default apiClient;