import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchAllUsers, deleteUser } from "@/lib/services/userService";
import { UserData } from "@/types/user.types";

interface UseTableGroupReturn {
    isLoading: boolean;
    error: string | null;
    tableData: UserData[];
    filteredTableData: UserData[];
    selectedUserIds: Set<number>;
    searchTerm: string;
    inputRef: React.RefObject<HTMLInputElement | null>; 
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectRow: (id: number) => void;
    handleSelectAll: () => void;
    handleDeleteSelected: () => Promise<void>;
    handleDeleteSingleUser: (userId: number, username: string) => Promise<void>;
    getUsers: () => Promise<void>;
}

export function useTableGroup(): UseTableGroupReturn {
    const { token } = useAuthStore();
    const [tableData, setTableData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);


    const getUsers = useCallback(async () => {
        if (!token) {
            console.warn("Token tidak tersedia. Tidak dapat memuat data pengguna.");
            setIsLoading(false);
            setError("Autentikasi diperlukan.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const users = await fetchAllUsers(token);
            setTableData(users);
            setSelectedUserIds(new Set());
        } catch (err: any) {
            console.error("Gagal memuat data pengguna:", err);
            setError(err.message || "Terjadi kesalahan saat memuat data pengguna.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredTableData = useMemo(() => {
        if (!searchTerm) {
            return tableData;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return tableData.filter(
            (user) =>
                user.fullname.toLowerCase().includes(lowercasedSearchTerm) ||
                user.email.toLowerCase().includes(lowercasedSearchTerm) ||
                user.username.toLowerCase().includes(lowercasedSearchTerm) ||
                (user.group && user.group.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [tableData, searchTerm]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleSelectRow = useCallback((id: number) => {
        setSelectedUserIds((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedUserIds.size === filteredTableData.length && filteredTableData.length > 0) {
            setSelectedUserIds(new Set());
        } else {
            setSelectedUserIds(new Set(filteredTableData.map((user) => user.id)));
        }
    }, [selectedUserIds.size, filteredTableData]);

    const handleDeleteSelected = useCallback(async () => {
        if (selectedUserIds.size === 0) {
            alert("Pilih setidaknya satu pengguna untuk dihapus.");
            return;
        }

        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedUserIds.size} pengguna yang dipilih?`)) {
            return;
        }

        setIsLoading(true);
        try {
            if (!token) throw new Error("Token autentikasi tidak tersedia.");

            const deletePromises = Array.from(selectedUserIds).map((userId) =>
                deleteUser(userId, token)
            );

            await Promise.all(deletePromises);

            await getUsers();
            setSelectedUserIds(new Set());
            alert("Pengguna berhasil dihapus!");
        } catch (err: any) {
            console.error("Gagal menghapus pengguna:", err);
            setError(err.message || "Terjadi kesalahan saat menghapus pengguna.");
            alert(`Gagal menghapus beberapa pengguna: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [selectedUserIds, token, getUsers]);

    const handleDeleteSingleUser = useCallback(async (userId: number, username: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna '${username}'?`)) {
            return;
        }

        setIsLoading(true);
        try {
            if (!token) throw new Error("Token autentikasi tidak tersedia.");

            await deleteUser(userId, token);
            setTableData((prevData) => prevData.filter((user) => user.id !== userId));
            setSelectedUserIds((prevSelected) => {
                const newSelected = new Set(prevSelected);
                newSelected.delete(userId);
                return newSelected;
            });
            alert(`Pengguna '${username}' berhasil dihapus!`);
        } catch (err: any) {
            console.error("Gagal menghapus pengguna tunggal:", err);
            setError(err.message || "Terjadi kesalahan saat menghapus pengguna.");
            alert(`Gagal menghapus pengguna: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return {
        isLoading,
        error,
        tableData,
        filteredTableData,
        selectedUserIds,
        searchTerm,
        inputRef,
        handleSearchChange,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        handleDeleteSingleUser,
        getUsers,
    };
}