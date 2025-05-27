
import { User } from "@/types/user.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type LoginResponse = {
    access: string;
};

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password
        }),
    });

    if (!response.ok) {
        throw new Error("Login gagal");
    }

    return await response.json();
};

export const fetchUserData = async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/api/v1/user/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data pengguna");
    }

    const data = await response.json();

    console.log("API:", data);
    console.log("TOKEN:", token);

    return data;
};