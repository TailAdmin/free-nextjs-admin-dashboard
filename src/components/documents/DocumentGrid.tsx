"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import { toast } from "sonner";
import { DocumentCard } from "@/components/documents/DocumentCard";

export default function DocumentGrid() {
    const { token } = useAuthStore();
    const {
        templates,
        loading,
        error,
        fetchTemplates,
        deleteTemplate,
    } = useDocumentStore();

    useEffect(() => {
        const loadTemplates = async () => {
            if (typeof token === "string") {
                await fetchTemplates(token);
            }
        };

        loadTemplates();
    }, [token]);

    if (loading) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-6">Memuat dokumen...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-6">{error}</p>;
    }

    if (!templates || templates.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-6">Tidak ada dokumen tersedia.</p>;
    }

    const handleDelete = async (id: number) => {
        if (typeof token !== "string") {
            toast.error("Token tidak tersedia");
            return;
        }

        try {
            await deleteTemplate(id, token);
            toast.success("Dokumen berhasil dihapus!");
        } catch (err) {
            console.log(err);
            toast.error("Gagal menghapus dokumen.");
        }
    };

    return (
        <div className="flex w-full overflow-x-auto">
                    <div className="flex  gap-6">
            {templates.map((doc) => (
                <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onDelete={() => handleDelete(doc.id)}
                />
            ))}
        </div>
        </div>
    );
}