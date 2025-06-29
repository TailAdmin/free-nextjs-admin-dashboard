// src/components/documents/DocumentCard.tsx
import React from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image"; 
import { DocumentCardProps } from "@/types/pdfTemplate.types";

export const DocumentCard = React.memo(({ doc, onDelete }: DocumentCardProps) => {
    const handleDelete = () => {
        toast.custom(
            (popup) => (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 max-w-sm">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Konfirmasi Hapus</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Yakin ingin menghapus dokumen ini?
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => {
                                toast.dismiss(popup);
                                onDelete();
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                        >
                            Ya
                        </button>
                        <button
                            onClick={() => toast.dismiss(popup)}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm rounded"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                position: "top-center",
            }
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <h3 className="px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-200 truncate">
                {doc.name}
            </h3>

            <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {doc.description || "Tidak ada deskripsi."}
                </p>

                {/* Gunakan thumbnail dari API /short-list/ di sini */}
                <div className="relative w-full h-[300px] border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {doc.thumbnail ? (
                        <Image
                            src={doc.thumbnail}
                            alt={`Thumbnail for ${doc.name}`}
                            layout="fill"
                            objectFit="contain" 
                            className="rounded-md"
                            loading="lazy"
                            unoptimized={true}
                        />
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-center">
                            Tidak ada preview (thumbnail)
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Hapus
                    </button>
                    <Link
                        href={`/fileproses/${doc.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Proses
                    </Link>
                </div>
            </div>
        </div>
    );
});

DocumentCard.displayName = "DocumentCard";