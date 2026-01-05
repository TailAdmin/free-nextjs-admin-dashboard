"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { userService } from "@/services/user.service";
import UserTable from "@/components/users/UserTable";
import UserModal from "@/components/users/UserModal";
import Breadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useSession } from "next-auth/react";

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await userService.getUsers({
                page: pagination.page,
                limit: pagination.limit,
            });
            setUsers(response.data || []);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            // Ideally show a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
            await userService.deleteUser(user.id);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user");
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            if (editingUser) {
                await userService.updateUser(editingUser.id, data);
            } else {
                await userService.createUser(data);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            console.error("Failed to save user:", error);
            alert(error.message || "Failed to save user");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Breadcrumb pageTitle="User Management" />

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Users
                </h2>
                <Button onClick={handleCreate} className="gap-2">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Add User
                </Button>
            </div>

            <div className="space-y-6">
                <UserTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                        {pagination.total} entries
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                user={editingUser}
                isLoading={isSubmitting}
            />
        </div>
    );
}
