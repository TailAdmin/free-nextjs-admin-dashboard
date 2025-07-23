// src/components/tables/BasicTableOne.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchSignatureHistory, deleteSignatureHistory } from "@/lib/services/signatureHistoryService";
import Button from "../ui/button/Button";
import { toast } from 'sonner';

// Impor ikon dari file index.tsx Anda
import { ChevronUpIcon, ChevronDownIcon } from "@/icons"; // Impor ChevronUpIcon dan ChevronDownIcon
// Jika Anda punya ikon filter di icons/index.tsx, Anda bisa mengimpornya juga:
// import { FilterIcon } from "@/icons";


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

    // State untuk Sorting
    const [sortConfig, setSortConfig] = useState<{ key: keyof SignatureHistoryItem | null; direction: 'ascending' | 'descending' }>({
        key: null,
        direction: 'ascending',
    });

    // State untuk Filtering
    const [filterText, setFilterText] = useState<string>('');

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
                    name: item.name,
                    description: item.description,
                    version: item.version,
                    user: {
                        name: item.created_by === "admin" ? "Admin" : `Pengguna: ${item.created_by.substring(0, 8)}...`,
                        role: "Petugas",
                    },
                    projectName: item.name,
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
    const handleDelete = async (id: string, docName: string) => {
        if (!token) {
            toast.error("Autentikasi diperlukan untuk menghapus data.");
            return;
        }

        toast.warning(
            `Apakah Anda yakin ingin menghapus dokumen "${docName}" (ID: ${id.substring(0, 8)}...)?`, {
            action: {
                label: 'Ya, Hapus',
                onClick: async () => {
                    try {
                        setIsLoading(true);
                        setError(null);
                        await deleteSignatureHistory(id, token);
                        setTableData(prevData => prevData.filter(item => item.id !== id));
                        toast.success(`Dokumen "${docName}" berhasil dihapus!`);
                    } catch (err: any) {
                        console.error(`Gagal menghapus data dengan ID ${id}:`, err);
                        toast.error(err.message || `Gagal menghapus dokumen "${docName}".`);
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

    // Fungsi untuk menangani sorting
    const handleSort = (key: keyof SignatureHistoryItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Fungsi untuk menangani perubahan input filter
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    // Logika sorting dan filtering menggunakan useMemo untuk performa
    const sortedAndFilteredData = useMemo(() => {
        let currentData = [...tableData];

        // 1. Filtering
        if (filterText) {
            const lowercasedFilter = filterText.toLowerCase();
            currentData = currentData.filter(item =>
                item.name.toLowerCase().includes(lowercasedFilter) ||
                item.description.toLowerCase().includes(lowercasedFilter) ||
                item.user.name.toLowerCase().includes(lowercasedFilter) ||
                item.status.toLowerCase().includes(lowercasedFilter) ||
                item.created_at.toLowerCase().includes(lowercasedFilter) ||
                item.updated_at.toLowerCase().includes(lowercasedFilter)
            );
        }

        // 2. Sorting
        if (sortConfig.key !== null) {
            currentData.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                // Handle nested 'user.name' for sorting
                if (sortConfig.key === 'user') {
                    aValue = a.user.name;
                    bValue = b.user.name;
                } else {
                    aValue = a[sortConfig.key!] || '';
                    bValue = b[sortConfig.key!] || '';
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return currentData;
    }, [tableData, sortConfig, filterText]);


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

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        value={filterText}
                        onChange={handleFilterChange}
                        className="pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                    {/* Jika Anda memiliki FilterIcon di index.tsx dan ingin menggunakannya: */}
                    {/* <FilterIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" /> */}
                    {/* Dan sesuaikan `pl-8` di className input jika ikon ini digunakan */}
                </div>
                {sortedAndFilteredData.length === 0 && tableData.length > 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ditemukan hasil untuk "{filterText}"</p>
                )}
                 {tableData.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada data histori tanda tangan yang tersedia.</p>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1200px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('user')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Petugas
                                            {sortConfig.key === 'user' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('projectName')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Nama Dokumen
                                            {sortConfig.key === 'projectName' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('description')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Deskripsi
                                            {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('version')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Versi
                                            {sortConfig.key === 'version' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Dibuat Pada
                                            {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('updated_at')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Diperbarui Pada
                                            {sortConfig.key === 'updated_at' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Status
                                            {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                                        </div>
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
                                {sortedAndFilteredData.length > 0 ? (
                                    sortedAndFilteredData.map((order) => (
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
                                                    onClick={() => handleDelete(order.id, order.name)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                            Tidak ada data yang cocok dengan kriteria filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );  
}