import React from "react";
import UserTable from "@/components/users/UserTable";
import { users } from "@/data/users";

export const metadata = {
    title: "Users | TailAdmin",
};

export default function UsersPage() {
    const handleEdit = (user: any) => {
        console.log("Edit user:", user);
    };

    const handleDelete = (id: string) => {
        console.log("Delete user:", id);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Users</h1>

            <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
