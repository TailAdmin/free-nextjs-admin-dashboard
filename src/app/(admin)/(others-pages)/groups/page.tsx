"use client";

import CreateUsersModal from "@/components/form/form-elements/CreateGroup";
import Button from "@/components/ui/button/Button";
import TableGroup from "@/components/ui/table/TableGroup";
import React, { useState } from "react";

export default function ManageUsersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshTableKey, setRefreshTableKey] = useState(0); 

    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    const handleUserCreated = () => {
        setRefreshTableKey(prevKey => prevKey + 1);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Manajemen Pengguna</h1>

            <div className="flex justify-end mb-4">
                <Button
                    onClick={handleOpenCreateModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Tambah Pengguna Baru
                </Button>
            </div>

            <TableGroup key={refreshTableKey} /> 

            <CreateUsersModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onUserCreated={handleUserCreated}
            />
        </div>
    );
}