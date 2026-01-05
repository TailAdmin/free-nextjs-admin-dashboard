import React, { useState, useEffect } from "react";
import { User, Role } from "@/types";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
// import Modal from "@/components/ui/modal/Modal"; // Assuming a Modal component exists or we build a simple one

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    user?: User | null; // If provided, we are editing
    isLoading?: boolean;
}

export default function UserModal({
    isOpen,
    onClose,
    onSubmit,
    user,
    isLoading = false,
}: UserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: Role.USER,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "", // Don't populate password for edit
                role: user.role,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: Role.USER,
            });
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user ? "Edit User" : "Add New User"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label>{user ? "New Password (Optional)" : "Password"}</Label>
                        <Input
                            type="password"
                            name="password"
                            placeholder={user ? "Leave blank to keep current" : "Secure Password"}
                            value={formData.password}
                            onChange={handleChange}
                            required={!user}
                            min="8"
                        />
                    </div>

                    <div>
                        <Label>Role</Label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full h-11 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:border-brand-500 transition-all"
                        >
                            <option value={Role.USER}>User</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            className="w-full justify-center"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full justify-center"
                        >
                            {isLoading ? "Saving..." : (user ? "Update User" : "Create User")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
