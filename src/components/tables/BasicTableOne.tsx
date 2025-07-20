// src/components/tables/BasicTableOne.tsx
"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image"; // Hapus impor ini jika tidak digunakan
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchSignatureHistory, deleteSignatureHistory } from "@/lib/services/signatureHistoryService";
import Button from "../ui/button/Button";
import { toast } from 'sonner';

interface SignatureHistoryItem {
    id: string;
    template: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    name: string; 
    description: string;
    version: string;
    user: {
        name: string;
        role: string;
    };
    projectName: string;
    status: string;
}

export default function BasicTableOne() {
    const { token } = useAuthStore();
    const [tableData, setTableData] = useState<SignatureHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fungsi untuk memuat data histori
    const getHistoryData = async () => {
        if (!token) {
            console.warn("Token tidak tersedia. Tidak dapat memuat histori tanda tangan.");
            setIsLoading(false);
            setError("Autentikasi diperlukan. Silakan login kembali.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const historyRawData = await fetchSignatureHistory(token);

            const mappedData: SignatureHistoryItem[] = historyRawData.map((item) => {
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };

                const createdAtFormatted = new Date(item.created_at).toLocaleString("id-ID", options);
                const updatedAtFormatted = new Date(item.updated_at).toLocaleString("id-ID", options);

                return {
                    id: item.id,
                    template: item.template,
                    created_by: item.created_by,
                    created_at: createdAtFormatted,
                    updated_at: updatedAtFormatted,
                    name: item.name, // Penting: pastikan nama dokumen diambil dari sini
                    description: item.description,
                    version: item.version,
                    user: {
                        // image: "/images/user/default-user.jpg", // Hapus baris ini jika tidak digunakan
                        name: item.created_by === "admin" ? "Admin" : `Pengguna: ${item.created_by.substring(0, 8)}...`,
                        role: "Petugas",
                    },
                    projectName: item.name, // projectName juga mengambil dari item.name
                    // team: { // Hapus properti team jika tidak digunakan
                    //     images: ["/images/user/user-placeholder.jpg"], // Hapus baris ini jika tidak digunakan
                    // },
                    status: "Selesai",
                };
            });
            setTableData(mappedData);
        } catch (err: any) {
            console.error("Gagal memuat data histori:", err);
            setError(err.message || "Terjadi kesalahan yang tidak diketahui saat memuat data.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menangani penghapusan menggunakan toast sonner
    // Ubah parameter agar menerima id dan nama dokumen
    const handleDelete = async (id: string, docName: string) => {
        if (!token) {
            toast.error("Autentikasi diperlukan untuk menghapus data.");
            return;
        }

        toast.warning(
            `Apakah Anda yakin ingin menghapus dokumen "${docName}" (ID: ${id.substring(0, 8)}...)?`, { // Pesan diubah
                action: {
                    label: 'Ya, Hapus',
                    onClick: async () => {
                        try {
                            setIsLoading(true);
                            setError(null);
                            await deleteSignatureHistory(id, token);
                            setTableData(prevData => prevData.filter(item => item.id !== id));
                            toast.success(`Dokumen "${docName}" berhasil dihapus!`); // Pesan sukses diubah
                        } catch (err: any) {
                            console.error(`Gagal menghapus data dengan ID ${id}:`, err);
                            toast.error(err.message || `Gagal menghapus dokumen "${docName}".`); // Pesan error diubah
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
                cancel: {
                    label: 'Batal',
                    onClick: () => toast.info("Penghapusan dibatalkan."),
                },
                duration: 5000,
                id: `delete-confirm-${id}`,
            });
    };

    useEffect(() => {
        getHistoryData();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500 dark:text-gray-400">Memuat data histori...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-500 dark:text-red-400">Error: {error}</p>
            </div>
        );
    }

    if (tableData.length === 0) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500 dark:text-gray-400">Tidak ada data histori tanda tangan yang tersedia.</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1200px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Petugas
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Nama Dokumen
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Deskripsi
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Versi
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Dibuat Pada
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Diperbarui Pada
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Aksi
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {tableData.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {order.user.name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {order.user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.projectName}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.description}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.version}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.created_at}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.updated_at}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={"success"}
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <Button
                                                onClick={() => handleDelete(order.id, order.name)} // Mengirim ID dan NAMA dokumen
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}