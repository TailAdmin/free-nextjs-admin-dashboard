export interface Profile {
    id: number;
    photo: string;
}

export interface Configuration {
    id: number;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
    configuration: Configuration;
    fullname: string;
    groups: { name: string; id: number }[];
}

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    detail: string;
}

export interface ForgotPasswordResponse {
    detail: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

// src/types/user.types.ts (Contoh)
export interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    fullname: string;
    username: string;
    configuration: {
        id: number;
        first_time_password: string;
    };
    is_active: boolean; // Pastikan ini ada
    group?: string; // Sesuai dengan kode Anda
}