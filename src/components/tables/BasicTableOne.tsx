"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDocById } from "@/lib/services/pdfTemplateService"; 
import { getDelegationUsers } from "@/lib/services/userService"; 
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { SignatureHistoryResponse } from "@/types/signatureHistory.types";
import { fetchSignatureHistory } from "@/lib/services/signatureHistoryService";

interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    projectName: string; 
    team: {
        images: string[];
    };
    status: string; 
}

export default function BasicTableOne() {
    const { token } = useAuthStore();
    const [tableData, setTableData] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getHistoryAndRelatedData = async () => {
            if (!token) {
                console.warn("Token tidak tersedia. Tidak dapat memuat histori tanda tangan.");
                setIsLoading(false);
                setError("Autentikasi diperlukan.");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const historyRawData: SignatureHistoryResponse[] = await fetchSignatureHistory(token);
                const templateIds = new Set(historyRawData.map(item => item.template));
                const userIds = new Set(historyRawData.map(item => item.created_by));

                const templateDetailsPromises = Array.from(templateIds).map(async (templateId) => {
                    try {
                        const template = await fetchDocById(templateId, token);
                        return { id: templateId, name: template.name };
                    } catch (e) {
                        console.error(`Gagal mengambil detail template ${templateId}:`, e);
                        return { id: templateId, name: "Nama Tidak Dikenal" }; 
                    }
                });
                const templateMap = new Map((await Promise.all(templateDetailsPromises)).map(t => [t.id, t.name]));

                let allUsers: any[] = []; 
                try {
                    allUsers = await getDelegationUsers(token); 
                } catch (e) {
                    console.warn("Gagal mengambil daftar pengguna untuk detail:", e);
                }
                const userMap = new Map(allUsers.map((user: any) => [
                    user.id, 
                    {
                        name: user.fullname || user.email,
                        image: "/images/user/default-user.jpg", 
                        role: "User", 
                    }
                ]));


                const mappedData: Order[] = historyRawData.map((item, index) => {
                    const templateName = templateMap.get(item.template) || "Dokumen Tanpa Nama";
                    const createdByUserDetail = userMap.get(item.created_by);

                    return {
                        id: index + 1, 
                        user: {
                            image: createdByUserDetail?.image || "/images/user/default-user.jpg",
                            name: createdByUserDetail?.name || `Pengguna ID: ${item.created_by}`,
                            role: createdByUserDetail?.role || "Tidak Diketahui",
                        },
                        projectName: templateName,
                        team: {
                            images: ["/images/user/user-placeholder.jpg"], 
                        },
                        status: "Selesai", 
                    };
                });
                setTableData(mappedData);
            } catch (err: any) {
                console.error("Gagal memuat data histori:", err);
                setError(err.message || "Terjadi kesalahan saat memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        getHistoryAndRelatedData();
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
                <p className="text-gray-500 dark:text-gray-400">Tidak ada data histori tanda tangan.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
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
                                    Nama Project
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Tim
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {tableData.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full">
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={order.user.image}
                                                    alt={order.user.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
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
                                        <div className="flex -space-x-2">
                                            {order.team.images.map((teamImage, index) => (
                                                <div
                                                    key={index}
                                                    className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                                                >
                                                    <Image
                                                        width={24}
                                                        height={24}
                                                        src={teamImage}
                                                        alt={`Team member ${index + 1}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                order.status.toLowerCase() === "active" || order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "selesai"
                                                    ? "success"
                                                    : order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "in_progress" || order.status.toLowerCase() === "dalam proses"
                                                    ? "warning"
                                                    : "error"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}