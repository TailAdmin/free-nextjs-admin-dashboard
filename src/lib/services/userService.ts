// src/lib/services/userService.ts
import {
    ApiResponseDetail,
    CurrentDelegationsResponse,
    DelegateSignaturePayload,
    DelegationUser,
} from "@/types/delegation.types";
import { UserData } from "@/types/user.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDelegationUsers = async (token: string): Promise<DelegationUser[]> => {
    try {
        const res = await fetch(`${API_URL}/signatures/user/user-list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Gagal mengambil daftar pengguna untuk delegasi.");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Error fetching delegation users list:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mengambil daftar pengguna.");
    }
};

export const getCurrentDelegations = async (token: string): Promise<CurrentDelegationsResponse> => {
    try {
        const res = await fetch(`${API_URL}/signatures/user/delegations/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Gagal mengambil delegasi saat ini.");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Error fetching current delegations:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mengambil delegasi saat ini.");
    }
};

export const delegateSignature = async (
    payload: DelegateSignaturePayload,
    token: string
): Promise<ApiResponseDetail> => {
    try {
        const res = await fetch(`${API_URL}/signatures/user/delegations/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || errorData.user_email?.join(", ") || "Gagal mendelegasikan tanda tangan.");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Gagal mendelegasikan tanda tangan:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mendelegasikan tanda tangan.");
    }
};

export const deleteDelegation = async (
    payload: { user_email: string },
    token: string
): Promise<ApiResponseDetail> => {
    try {
        const res = await fetch(`${API_URL}/signatures/user/delegations/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Gagal membatalkan delegasi.");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Gagal membatalkan delegasi:", error);
        throw new Error(error.message || "Terjadi kesalahan saat membatalkan delegasi.");
    }
};

export async function fetchAllUsers(token: string): Promise<UserData[]> {
    if (!token) {
        throw new Error("Autentikasi diperlukan: Token tidak tersedia.");
    }

    const response = await fetch(`${API_URL}/auth/admin/manage-user/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal memuat pengguna: Status ${response.status} - ${errorText}`);
    }

    return response.json();
}

export async function disableUser(userId: number, token: string): Promise<void> {
    if (!token) {
        throw new Error("Autentikasi diperlukan: Token tidak tersedia.");
    }

    const response = await fetch(`${API_URL}/auth/admin/manage-user/${userId}/disable-user/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menonaktifkan pengguna ID ${userId}: Status ${response.status} - ${errorText}`);
    }
}

// Fungsi baru untuk mengaktifkan pengguna
export async function enableUser(userId: number, token: string): Promise<void> {
    if (!token) {
        throw new Error("Autentikasi diperlukan: Token tidak tersedia.");
    }

    const response = await fetch(`${API_URL}/auth/admin/manage-user/${userId}/enable-user/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengaktifkan pengguna ID ${userId}: Status ${response.status} - ${errorText}`);
    }
}