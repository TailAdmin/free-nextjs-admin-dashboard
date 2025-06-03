// ProfileClientWrapper.tsx
"use client";

import React, { useState } from "react";
import ProfileView from "./ProfileView";
import { useProfileData } from "@/hooks/useProfileData";

export default function ProfileClientWrapper() {
    const [isModalOpen, setModalOpen] = useState(false);
    const { signatureImage, loading, refetchSignature, uploadSignature } = useProfileData();

    const handleUpload = async (file: File) => {
        await uploadSignature(file);
        setModalOpen(false);
    };

    return (
        <ProfileView
            signatureImage={signatureImage}
            loading={loading}
            isModalOpen={isModalOpen}
            onOpenModal={() => setModalOpen(true)}
            onCloseModal={() => setModalOpen(false)}
            onUpload={handleUpload}
            refetchSignature={refetchSignature}
        />
    );
}