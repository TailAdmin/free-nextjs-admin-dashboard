// src/components/admin/CreateUsersModal.tsx
"use client";

import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    group: string | null;
}

interface Group {
    id: number;
    name: string;
    permissions: any[];
}

interface Option {
    value: string;
    label: string;
}

interface CreateUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void; // Callback opsional setelah user berhasil dibuat
}

const CreateUsersModal: React.FC<CreateUsersModalProps> = ({ isOpen, onClose, onUserCreated }) => {
    const [formData, setFormData] = useState<UserData>({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        group: null,
    });
    const [availableGroups, setAvailableGroups] = useState<Option[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true); // Ganti nama state loading
    const [errorGroups, setErrorGroups] = useState<string | null>(null); // Ganti nama state error
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useAuthStore();

    // Reset form saat modal dibuka atau ditutup
    useEffect(() => {
        if (isOpen) {
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                username: "",
                group: null,
            });
            // Fetch groups setiap kali modal dibuka, atau hanya sekali jika diinginkan
            fetchGroups();
        }
    }, [isOpen]);

    const fetchGroups = async () => {
        if (!API_BASE_URL) {
            setErrorGroups("Variabel lingkungan NEXT_PUBLIC_API_BASE_URL tidak ditemukan.");
            setLoadingGroups(false);
            toast.error("Kesalahan Konfigurasi", {
                description: "Variabel lingkungan NEXT_PUBLIC_API_BASE_URL tidak ditemukan. Mohon periksa konfigurasi Anda.",
            });
            return;
        }

        setLoadingGroups(true);
        setErrorGroups(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/admin/role-group/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Group[] = await response.json();
            const options: Option[] = data.map((group) => ({
                value: group.id.toString(), // convert ke string
                label: group.name,
            }));
            setAvailableGroups(options);
        } catch (e: any) {
            setErrorGroups(`Gagal mengambil grup: ${e.message}`);
            toast.error("Gagal Memuat Grup", {
                description: `Terjadi kesalahan saat mengambil daftar grup: ${e.message}`,
            });
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGroupChange = (selectedValue: string) => {
        setFormData((prev) => ({
            ...prev,
            group: selectedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorGroups(null); // Reset error form submission

        if (!token) {
            toast.error("Autentikasi Diperlukan", {
                description: "Token otentikasi tidak tersedia. Silakan login kembali.",
            });
            setIsSubmitting(false);
            return;
        }

        if (!API_BASE_URL) {
            setErrorGroups("Variabel lingkungan NEXT_PUBLIC_API_BASE_URL tidak ditemukan.");
            setIsSubmitting(false);
            toast.error("Kesalahan Konfigurasi", {
                description: "Variabel lingkungan NEXT_PUBLIC_API_BASE_URL tidak ditemukan. Mohon periksa konfigurasi Anda.",
            });
            return;
        }

        const loadingToastId = toast.loading("Mengirim data pengguna...");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/admin/manage-user/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    group: formData.group ? parseInt(formData.group) : null, // convert kembali ke number
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || errorData.email || errorData.username || response.statusText;
                throw new Error(`Gagal menyimpan pengguna: ${errorMessage}`);
            }

            toast.success("Pengguna Berhasil Disimpan!", {
                id: loadingToastId,
                description: "Data pengguna baru telah berhasil ditambahkan.",
            });

            // Panggil callback untuk memberitahu komponen parent (misal, untuk refresh tabel)
            onUserCreated();
            onClose(); // Tutup modal setelah berhasil
        } catch (e: any) {
            setErrorGroups(`Terjadi kesalahan: ${e.message}`); // Set error untuk display di modal
            toast.error("Gagal Menyimpan Pengguna", {
                id: loadingToastId,
                description: `Terjadi kesalahan: ${e.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-8"> {/* Atur ukuran modal di sini */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tambah Pengguna Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {errorGroups && ( // Tampilkan error terkait fetching grup atau submission
                    <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/20 dark:text-red-400">
                        {errorGroups}
                    </div>
                )}

                {["first_name", "last_name", "email", "username"].map((field) => (
                    <div key={field}>
                        <label
                            htmlFor={field}
                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                            {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                        <input
                            type={field === "email" ? "email" : "text"}
                            id={field}
                            name={field}
                            value={formData[field as keyof UserData] as string}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:border-brand-500 focus:ring focus:ring-brand-500 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            required
                        />
                    </div>
                ))}

                <div>
                    <label
                        htmlFor="group_select"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                        Pilih Grup
                    </label>
                    {loadingGroups ? (
                        <div className="h-11 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white flex items-center">
                            Memuat grup...
                        </div>
                    ) : errorGroups && !availableGroups.length ? (
                        <div className="h-11 w-full rounded-lg border border-red-500 bg-red-50 py-2 px-3 text-red-700 shadow-sm dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 flex items-center">
                            Error memuat grup: {errorGroups}
                        </div>
                    ) : (
                        <Select
                            options={availableGroups}
                            placeholder="Pilih grup"
                            onChange={handleGroupChange}
                            defaultValue={formData.group ?? undefined}
                            // Pastikan Select Anda dapat mengelola nilai `null` atau `undefined` untuk pilihan default
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-600 py-2 px-4 text-white font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                    disabled={loadingGroups || isSubmitting || !API_BASE_URL}
                >
                    {isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
            </form>
        </Modal>
    );
};

export default CreateUsersModal;