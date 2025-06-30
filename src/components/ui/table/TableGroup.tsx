// src/components/TableGroup.tsx
"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Checkbox from "@/components/form/input/Checkbox";
import Badge from "@/components/ui/badge/Badge";
import { CheckCircleIcon, TrashBinIcon } from "@/icons";
import { useTableGroup } from "@/hooks/useTableGroup";


const getBadgeColor = (group: string): "success" | "warning" | "info" => {
    switch (group.toLowerCase()) {
        case "superadmin":
            return "success";
        case "admin":
            return "warning";
        case "user":
            return "info";
        default:
            return "info";
    }
};

const getStatusBadgeColor = (isActive: boolean): "success" | "error" => {
    return isActive ? "success" : "error";
};

export default function TableGroup() {
    const {
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
    } = useTableGroup();


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 animate-pulse">
                <p className="text-gray-500 dark:text-gray-400">Memuat data pengguna...</p>
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

    const isDataEmpty = tableData.length === 0;
    const isFilteredDataEmpty = filteredTableData.length === 0 && searchTerm;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
                <Button
                    onClick={handleDisableSelected}
                    disabled={selectedUserIds.size === 0}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2"
                >
                    Nonaktifkan Dipilih ({selectedUserIds.size})
                </Button>

                <div className="w-full lg:w-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                                <svg
                                    className="fill-gray-500 dark:fill-gray-400"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                        fill=""
                                    />
                                </svg>
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Cari atau ketik perintah..."
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900  dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                type="button"
                                onClick={() => inputRef.current?.focus()}
                                className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                            >
                                <span> ⌘ </span>
                                <span> K </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- Bagian Tabel Utama --- */}
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-16"
                                >
                                    <Checkbox
                                        checked={selectedUserIds.size === filteredTableData.length && filteredTableData.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Nama Lengkap
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Username
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Grup
                                </TableCell>
                                {/* Kolom Status */}
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
                            {filteredTableData.length > 0 ? (
                                filteredTableData.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <Checkbox
                                                checked={selectedUserIds.has(user.id)}
                                                onChange={() => handleSelectRow(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className={`block font-medium text-theme-sm ${user.is_active ? 'text-gray-800 dark:text-white/90' : 'text-red-500 dark:text-red-400'}`}>
                                                        {user.fullname}
                                                    </span>
                                                    <span className={`block text-theme-xs ${user.is_active ? 'text-gray-500 dark:text-gray-400' : 'text-red-400 dark:text-red-300'}`}>
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className={`px-4 py-3 text-start text-theme-sm ${user.is_active ? 'text-gray-500 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {user.email}
                                        </TableCell>
                                        <TableCell className={`px-4 py-3 text-start text-theme-sm ${user.is_active ? 'text-gray-500 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {user.username}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={getBadgeColor(user.group ?? "")}
                                            >
                                                {user.group ?? "Tidak Diketahui"}
                                            </Badge>
                                        </TableCell>
                                        {/* Sel untuk Kolom Status */}
                                        <TableCell className="px-4 py-3 text-start text-theme-sm">
                                            <Badge
                                                size="sm"
                                                color={getStatusBadgeColor(user.is_active)}
                                            >
                                                {user.is_active ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </TableCell>
                                        {/* Aksi berdasarkan status is_active */}
                                        <TableCell className="px-4 py-3 text-start">
                                            {user.is_active ? (
                                                <TrashBinIcon // Ikon untuk menonaktifkan (karena user aktif)
                                                    className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                    onClick={() => handleDisableSingleUser(user.id, user.username)}
                                                    title={`Nonaktifkan pengguna ${user.username}`}
                                                />
                                            ) : (
                                                <CheckCircleIcon // Ikon untuk mengaktifkan (karena user nonaktif)
                                                    className="h-6 w-6 text-green-500 cursor-pointer hover:text-green-700 transition-colors"
                                                    onClick={() => handleEnableSingleUser(user.id, user.username)}
                                                    title={`Aktifkan pengguna ${user.username}`}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                        {isFilteredDataEmpty ?
                                            "Tidak ada pengguna yang cocok dengan pencarian Anda." :
                                            "Tidak ada data pengguna."
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* --- Bagian Footer --- */}
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Menampilkan {filteredTableData.length} dari {tableData.length} entri.
            </div>
        </div>
    );
}