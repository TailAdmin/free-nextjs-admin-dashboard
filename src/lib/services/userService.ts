import { DelegationUser } from "@/types/delegation.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDelegationUsers = async (token: string): Promise<DelegationUser[]> => {
    const res = await fetch(`${API_URL}/signatures/user/user-list/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Gagal fetch data delegasi");
    }

    return await res.json();
};
