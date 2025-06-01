import React from "react";
import { toast } from "sonner";
import { PdfPreview } from "./PdfPreview";

interface DocumentCardProps {
    doc: {
        id: number;
        name: string;
        description: string;
        example_file: string;
    };
    onDelete: () => void;
}

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
            <h3 className="px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-200">
                {doc.name}
            </h3>

            <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doc.description}</p>

                <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden h-[300px]">
                    <PdfPreview url={`https://docs.google.com/gview?url=${encodeURIComponent(doc.example_file)}&embedded=true`} />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Hapus
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                        Proses
                    </button>
                </div>
            </div>
        </div>
    );
});

DocumentCard.displayName = "DocumentCard";