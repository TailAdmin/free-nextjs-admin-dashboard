// src/hooks/useTableGroup.ts
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchAllUsers, disableUser, enableUser } from "@/lib/services/userService";
import { UserData } from "@/types/user.types";
// import { confirmAlert } from "react-confirm-alert"; // ❌ Tidak perlu lagi jika menggunakan Sonner untuk "konfirmasi"
// import "react-confirm-alert/src/react-confirm-alert.css"; // ❌ Tidak perlu lagi

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
    handleDisableSelected: () => Promise<void>;
    handleDisableSingleUser: (userId: number, username: string) => Promise<void>;
    handleEnableSingleUser: (userId: number, username: string) => Promise<void>;
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
            toast.error("Gagal memuat data pengguna", {
                description: err.message || "Silakan coba lagi.",
            });
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

    const handleDisableSelected = useCallback(async () => {
        if (selectedUserIds.size === 0) {
            toast.warning("Tidak ada pengguna dipilih");
            return;
        }

        const confirmToastId = toast.info(
            `Apakah Anda yakin ingin menonaktifkan ${selectedUserIds.size} pengguna yang dipilih?`,
            {
                action: {
                    label: "Ya, Nonaktifkan",
                    onClick: async () => {
                        setIsLoading(true);
                        try {
                            if (!token) throw new Error("Token autentikasi tidak tersedia.");

                            const disablePromises = Array.from(selectedUserIds).map((userId) =>
                                disableUser(userId, token)
                            );

                            await Promise.all(disablePromises);

                            await getUsers();
                            setSelectedUserIds(new Set());
                            toast.success("Pengguna berhasil dinonaktifkan!");
                        } catch (err: any) {
                            console.error("Gagal menonaktifkan pengguna:", err);
                            setError(err.message || "Terjadi kesalahan saat menonaktifkan pengguna.");
                            toast.error("Gagal menonaktifkan pengguna", {
                                description: err.message,
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
                cancel: {
                    label: "Batal",
                    onClick: () => {
                        toast.dismiss(confirmToastId);
                    },
                },
                duration: Infinity, // Toast akan tetap ada sampai di-dismiss atau di-klik
            }
        );
    }, [selectedUserIds, token, getUsers]);

    const handleDisableSingleUser = useCallback(async (userId: number, username: string) => {
        const confirmToastId = toast.info(
            `Apakah Anda yakin ingin menonaktifkan pengguna '${username}'?`,
            {
                action: {
                    label: "Ya, Nonaktifkan",
                    onClick: async () => {
                        setIsLoading(true);
                        try {
                            if (!token) throw new Error("Token autentikasi tidak tersedia.");

                            await disableUser(userId, token);
                            setTableData((prevData) =>
                                prevData.map((user) =>
                                    user.id === userId ? { ...user, is_active: false } : user
                                )
                            );
                            setSelectedUserIds((prevSelected) => {
                                const newSelected = new Set(prevSelected);
                                newSelected.delete(userId);
                                return newSelected;
                            });
                            toast.success(`Pengguna '${username}' berhasil dinonaktifkan!`);
                        } catch (err: any) {
                            console.error("Gagal menonaktifkan pengguna tunggal:", err);
                            setError(err.message || "Terjadi kesalahan saat menonaktifkan pengguna.");
                            toast.error(`Gagal menonaktifkan pengguna`, {
                                description: err.message,
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
                cancel: {
                    label: "Batal",
                    onClick: () => {
                        toast.dismiss(confirmToastId);
                    },
                },
                duration: Infinity,
            }
        );
    }, [token]);

    const handleEnableSingleUser = useCallback(async (userId: number, username: string) => {
        const confirmToastId = toast.info(
            `Apakah Anda yakin ingin mengaktifkan pengguna '${username}'?`,
            {
                action: {
                    label: "Ya, Aktifkan",
                    onClick: async () => {
                        setIsLoading(true);
                        try {
                            if (!token) throw new Error("Token autentikasi tidak tersedia.");

                            await enableUser(userId, token);
                            setTableData((prevData) =>
                                prevData.map((user) =>
                                    user.id === userId ? { ...user, is_active: true } : user
                                )
                            );
                            toast.success(`Pengguna '${username}' berhasil diaktifkan!`);
                        } catch (err: any) {
                            console.error("Gagal mengaktifkan pengguna tunggal:", err);
                            setError(err.message || "Terjadi kesalahan saat mengaktifkan pengguna.");
                            toast.error(`Gagal mengaktifkan pengguna`, {
                                description: err.message,
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
                cancel: {
                    label: "Batal",
                    onClick: () => {
                        toast.dismiss(confirmToastId);
                    },
                },
                duration: Infinity,
            }
        );
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
        handleDisableSelected,
        handleDisableSingleUser,
        handleEnableSingleUser,
        getUsers,
    };
}