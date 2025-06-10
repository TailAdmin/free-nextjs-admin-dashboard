// src/components/user-profile/UserSignature.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SignatureModal } from "@/components/modal/SignatureModal";
import MultiSelect from "../form/MultiSelect";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import Button from "../ui/button/Button";
import { toast } from "sonner";
import LoadingSpinner from "../ui/loading/LoadingSpinner";

// Import fungsi dari userService
import { 
    getDelegationUsers, 
    delegateSignature, 
    // getCurrentDelegations, // Hapus import ini karena tidak lagi digunakan di sini
    deleteDelegation,
} from "@/lib/services/userService"; 

// Import tipe dari types/delegation.types.ts
import { 
    DelegationUser, // Tetap diperlukan untuk tipe getDelegationUsers
    // CurrentDelegationsResponse, // Hapus import ini karena tidak lagi digunakan di sini
} from "@/types/delegation.types";

interface UserSignatureProps {
    signatureImage: string | null;
    loading: boolean;
    isModalOpen: boolean;
    onOpenModal: () => void;
    onCloseModal: () => void;
    refetchSignature: () => void;
}

export default function UserSignature({
    signatureImage,
    loading: signatureLoading, 
    isModalOpen,
    onOpenModal,
    onCloseModal,
    refetchSignature,
}: UserSignatureProps) {
    console.log("ProfileView rendered");
    const [multiOptions, setMultiOptions] = useState<{ value: string; text: string; selected: boolean }[]>([]);
    const [currentSelectedDelegates, setCurrentSelectedDelegates] = useState<string[]>([]);
    const [delegationOperationLoading, setDelegationOperationLoading] = useState<boolean>(false);
    const [initialDelegatesLoading, setInitialDelegatesLoading] = useState<boolean>(true);

    const { token } = useAuthStore();

    useEffect(() => {
        const fetchAllDelegationData = async () => {
            if (!token) {
                setInitialDelegatesLoading(false);
                return;
            }

            setInitialDelegatesLoading(true);
            try {
                // 1. Ambil semua user yang bisa didelegasikan
                const allUsers: DelegationUser[] = await getDelegationUsers(token);
                
                // 2. Sekarang, karena tidak ada getCurrentDelegations, kita asumsikan tidak ada yang dipilih di awal.
                // Atau, jika ada cara lain untuk menentukan yang sudah didelegasikan (misalnya dari data allUsers itu sendiri),
                // maka logika itu bisa ditambahkan di sini.
                // Untuk saat ini, kita inisialisasi sebagai array kosong.
                const currentlyDelegatedEmails: string[] = []; // Default: Tidak ada yang terpilih di awal

                // 3. Gabungkan data: Buat opsi MultiSelect dan tandai yang sudah didelegasikan
                const mappedOptions = allUsers.map((user) => ({
                    value: user.email,
                    text: user.fullname,
                    selected: currentlyDelegatedEmails.includes(user.email), // Ini akan selalu false di awal
                }));
                setMultiOptions(mappedOptions);
                setCurrentSelectedDelegates(currentlyDelegatedEmails); // Ini akan selalu array kosong di awal

            } catch (error) {
                console.error("Error fetching user list for delegation:", error);
                toast.error("Gagal memuat daftar pengguna untuk delegasi. Silakan refresh halaman.");
            } finally {
                setInitialDelegatesLoading(false);
            }
        };

        fetchAllDelegationData();
    }, [token]);

    const handleMultiSelectChange = (newSelectedValues: string[]) => {
        setCurrentSelectedDelegates(newSelectedValues);
    };

    const handleSaveDelegation = async () => {
        if (!token) {
            toast.error("Anda tidak login. Silakan login kembali.");
            return;
        }

        setDelegationOperationLoading(true);
        try {
            // Karena kita tidak lagi mengambil delegasi yang sudah ada dari backend di awal load,
            // kita perlu memikirkan bagaimana 'previousSelectedOnUI' ditentukan.
            // Jika Anda hanya ingin menyimpan *semua* yang dipilih, dan menghapus *semua* yang tidak dipilih,
            // maka Anda mungkin perlu logika yang berbeda atau API yang stateless.
            // Namun, jika API DELETE/POST Anda idempotent (bisa dipanggil berulang tanpa masalah),
            // maka logika ini tetap berfungsi untuk sinkronisasi.

            // Asumsi: 'multiOptions' saat ini mencerminkan keadaan terakhir yang berhasil disimpan/dimuat.
            const previousSelectedOnUI = multiOptions
                .filter(opt => opt.selected)
                .map(opt => opt.value);
            
            const previousDelegatesSet = new Set(previousSelectedOnUI);
            const newDelegatesSet = new Set(currentSelectedDelegates);

            const delegatesToAdd = [...newDelegatesSet].filter(email => !previousDelegatesSet.has(email));
            const delegatesToRemove = [...previousDelegatesSet].filter(email => !newDelegatesSet.has(email));

            if (delegatesToAdd.length > 0) {
                await Promise.all(delegatesToAdd.map(email => delegateSignature({ user_email: email }, token)));
            }

            if (delegatesToRemove.length > 0) {
                await Promise.all(delegatesToRemove.map(email => deleteDelegation({ user_email: email }, token)));
            }

            toast.success("Delegasi tanda tangan berhasil diperbarui!");
            
            // Perbarui opsi UI agar sesuai dengan pilihan yang baru disimpan
            const updatedOptions = multiOptions.map(option => ({
                ...option,
                selected: newDelegatesSet.has(option.value)
            }));
            setMultiOptions(updatedOptions);

        } catch (error: any) {
            console.error("Error saving delegation:", error);
            const errorMessage = error.message || "Gagal menyimpan delegasi tanda tangan.";
            toast.error(errorMessage);
        } finally {
            setDelegationOperationLoading(false);
        }
    };

    const renderSignaturePreview = () => {
        if (signatureLoading) return <p className="text-sm text-gray-500">Memuat tanda tangan...</p>;
        if (!signatureImage) return null;

        return (
            <div className="mt-4">
                <label className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Tanda Tangan Anda
                </label>
                <br />
                <br />
                <Image src={signatureImage} alt="Tanda Tangan Pengguna" width={200} height={100}/>
            </div>
        );
    };

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                    <div className="flex-shrink-0">{renderSignaturePreview()}</div>

                    <div className="flex-grow flex items-center justify-end mt-4 xl:mt-0">
                        <button
                            type="button"
                            onClick={onOpenModal}
                            aria-label={signatureImage ? "Ubah Tanda Tangan" : "Upload Tanda Tangan"}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.05470 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.27340 14.6934 5.56629L14.0440 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.63590 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.12620 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                />
                            </svg>
                            {signatureImage ? "Ubah Tanda Tangan" : "Upload Tanda Tangan"}
                        </button>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <div className="relative">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Delegasikan Tanda Tangan
                </label>
                {initialDelegatesLoading ? (
                    <LoadingSpinner message="Memuat daftar delegasi..." />
                ) : (
                    <MultiSelect
                        label="Pilih User untuk Delegasi"
                        options={multiOptions}
                        // Default selected akan selalu array kosong saat pertama render
                        defaultSelected={currentSelectedDelegates} 
                        onChange={handleMultiSelectChange}
                    />
                )}
                
                <p className="sr-only">Selected Values: {currentSelectedDelegates.join(", ")}</p>
                <Button
                    onClick={handleSaveDelegation}
                    disabled={delegationOperationLoading || initialDelegatesLoading}
                    className="mt-6 w-full lg:w-auto"
                >
                    {delegationOperationLoading ? (
                        <LoadingSpinner size="sm" message="Menyimpan Delegasi..." />
                    ) : (
                        "Simpan Delegasi"
                    )}
                </Button>
            </div>

            {isModalOpen && (
                <SignatureModal
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    onSuccessUpload={refetchSignature}
                />
            )}
        </div>
    );
}