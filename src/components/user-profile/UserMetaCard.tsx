// components/UserMetaCard.tsx
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
import LoadingSpinner from "../ui/loading/LoadingSpinner";

// Import komponen LoadingSpinner yang sudah Anda buat


export default function UserMetaCard() {
    const { isOpen: isPasswordModalOpen, openModal: openPasswordModal, closeModal: closePasswordModal } = useModal();

    const { user } = useAuthStore();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');

    // State untuk form ubah password
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // --- State baru untuk loading ---
    const [isLoading, setIsLoading] = useState(false);


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

        // --- Set loading true saat memulai proses ---
        setIsLoading(true);

        try {
            await changePassword({ old_password: oldPassword, new_password: newPassword });
            toast.success("Kata sandi berhasil diubah!");
            setOldPassword('');
            setNewPassword('');
            closePasswordModal();
        } catch (error: any) {
            console.error("Gagal mengubah kata sandi:", error);
            const errorMessage = error.message;
            toast.error("Gagal mengubah kata sandi", {
                description: errorMessage,
            });
        } finally {
            // --- Set loading false setelah proses selesai (sukses atau gagal) ---
            setIsLoading(false);
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
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isLoading} // Nonaktifkan input saat loading
                                />
                            </div>
                            <div className="mb-5">
                                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading} // Nonaktifkan input saat loading
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closePasswordModal} disabled={isLoading}>
                                Tutup
                            </Button>
                            <Button size="sm" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" colorClass="text-white" /> Memproses...
                                    </>
                                ) : (
                                    'Simpan Kata Sandi Baru'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}