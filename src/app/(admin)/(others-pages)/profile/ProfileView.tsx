"use client";

import React from "react";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserSignature from "@/components/user-profile/userSignature";

interface ProfileViewProps {
    signatureImage: string | null;
    loading: boolean;
    isModalOpen: boolean;
    onOpenModal: () => void;
    onCloseModal: () => void;
    onUpload: (file: File) => Promise<void>;
    refetchSignature: () => void;
}

export default function ProfileView({
    signatureImage,
    loading,
    isModalOpen,
    onOpenModal,
    onCloseModal,
    refetchSignature,
}: ProfileViewProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                Profile
            </h3>

            <div className="space-y-6">
                <UserMetaCard />
                <UserInfoCard />
                <UserSignature
                    signatureImage={signatureImage}
                    loading={loading}
                    isModalOpen={isModalOpen}
                    onOpenModal={onOpenModal}
                    onCloseModal={onCloseModal}
                    refetchSignature={refetchSignature}
                />
            </div>
        </div>
    );
}
