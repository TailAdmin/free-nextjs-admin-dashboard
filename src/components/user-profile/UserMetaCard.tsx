import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { toast } from "sonner"; 

import { changePassword } from "@/lib/services/authService"; 

export default function UserMetaCard() {
    const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
    const { isOpen: isPasswordModalOpen, openModal: openPasswordModal, closeModal: closePasswordModal } = useModal(); 
    
    const { user } = useAuthStore(); 

    // State untuk form edit personal information
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');

    // State untuk form ubah password
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Handle save logic for personal information
    const handleSavePersonalInfo = () => {
        console.log("Saving personal information:", { firstName, lastName, email });
        toast.success("Perubahan informasi pribadi berhasil disimpan!");
        closeEditModal();
    };

    // --- Fungsi untuk mengubah password ---
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman
        
        if (!user) {
            toast.error("Anda tidak login. Silakan login kembali.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Kata sandi baru harus minimal 8 karakter.");
            return;
        }

        if (oldPassword === newPassword) {
            toast.error("Kata sandi baru tidak boleh sama dengan kata sandi lama.");
            return;
        }

        try {
            await changePassword({ old_password: oldPassword, new_password: newPassword });
            toast.success("Kata sandi berhasil diubah!");
            setOldPassword(''); // 
            setNewPassword(''); 
            closePasswordModal();
        } catch (error: any) {
            console.error("Gagal mengubah kata sandi:", error);
            const errorMessage = error.message || "Gagal mengubah kata sandi. Silakan coba lagi.";
            toast.error(errorMessage);
        }
    };

    if (!user) return null;

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <Image
                                width={80}
                                height={80}
                                src={user.profile.photo}
                                alt="user"
                            />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {user.fullname}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.id}
                                </p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Indonesia
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Tombol Edit Informasi Pribadi */}
                    <button
                        onClick={openEditModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill=""></path>
                        </svg>
                        Edit
                    </button>
                    {/* Tombol Ubah Kata Sandi */}
                    <button
                        onClick={openPasswordModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7H6C5.73478 7 5.48043 6.89464 5.29289 6.70711C5.10536 6.51957 5 6.26522 5 6V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H12C12.2652 4 12.5196 4.10536 12.7071 4.29289C12.8946 4.48043 13 4.73478 13 5V6C13 6.26522 12.8946 6.51957 12.7071 6.70711C12.5196 6.89464 12.2652 7 12 7ZM15 7V6C15 5.06087 14.6318 4.15935 13.9697 3.49729C13.3076 2.83523 12.4061 2.46696 11.5 2.46696H6.5C5.59395 2.46696 4.69237 2.83523 4.03031 3.49729C3.36825 4.15935 3 5.06087 3 6V7C2.46957 7 1.96086 7.21071 1.58579 7.58579C1.21071 7.96086 1 8.46957 1 9V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V9C17 8.46957 16.7893 7.96086 16.4142 7.58579C16.0391 7.21071 15.5304 7 15 7Z" fill=""></path>
                        </svg>
                        Ubah Kata Sandi
                    </button>
                </div>
            </div>

            {/* Modal Edit Personal Information */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Personal Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your profile up-to-date.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="firstName">Nama Depan</Label>
                                        <Input 
                                            id="firstName"
                                            type="text" 
                                            defaultValue={firstName} 
                                            onChange={(e) => setFirstName(e.target.defaultValue)} 
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="lastName">Nama Belakang</Label>
                                        <Input 
                                            id="lastName"
                                            type="text" 
                                            defaultValue={lastName} 
                                            onChange={(e) => setLastName(e.target.defaultValue)} 
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input 
                                            id="email"
                                            type="email" 
                                            defaultValue={email} 
                                            onChange={(e) => setEmail(e.target.defaultValue)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeEditModal}>
                                Tutup
                            </Button>
                            <Button size="sm" onClick={handleSavePersonalInfo}>
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* --- Modal Ubah Kata Sandi Baru --- */}
            <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal} className="max-w-[500px] m-4">
                <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Ubah Kata Sandi
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Pastikan kata sandi baru Anda kuat dan belum pernah digunakan sebelumnya.
                        </p>
                    </div>
                    <form onSubmit={handleChangePassword} className="flex flex-col">
                        <div className="custom-scrollbar px-2 pb-3">
                            <div className="mb-5">
                                <Label htmlFor="oldPassword">Kata Sandi Lama</Label>
                                <Input 
                                    id="oldPassword"
                                    type="password" 
                                    value={oldPassword} //
                                    onChange={(e) => setOldPassword(e.target.value)} 
                                    
                                />
                            </div>
                            <div className="mb-5">
                                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                                <Input 
                                    id="newPassword"
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closePasswordModal}>
                                Tutup
                            </Button>
                            <Button size="sm" type="submit">
                                Simpan Kata Sandi Baru
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}