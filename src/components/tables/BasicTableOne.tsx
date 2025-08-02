"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchSignatureHistory, deleteSignatureHistory } from "@/lib/services/signatureHistoryService";
import Button from "../ui/button/Button";
import { toast } from "sonner";
import { ChevronUpIcon, ChevronDownIcon } from "@/icons";
import dayjs from "dayjs";
import { Modal } from "../ui/modal";
import ComponentCard from "../common/ComponentCard";


interface DocumentSignatureHistory {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  documentTypeName: string;
  documentVersion: string;
  description: string;
  signPriName: string;
  signReceiverName: string;
  documentUrl: string;
}

interface SignatureHistoryItem {
  id: string;
  template: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  version: string;
  user: {
    name: string;
    role: string;
  };
  projectName: string;
  status: string;
}

// Modal Component Inside the Same File
const PdfModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}> = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen || !pdfUrl) return null;



  return (
        <Modal isOpen={isOpen}
        onClose={onClose}
        className="max-w-[600px] p-5 lg:p-10"
        >
        <div className="w-full h-[80vh] overflow-hidden">
            <center>
            <iframe
            src={pdfUrl}
            className="w-full h-[100vh] rounded border"
            title="PDF Preview"
          ></iframe>
            </center>
        </div>
        </Modal>
  );
};

export default function BasicTableOne() {
  const { token } = useAuthStore();
  const [tableData, setTableData] = useState<DocumentSignatureHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SignatureHistoryItem | null; direction: "ascending" | "descending" }>({
    key: null,
    direction: "ascending",
  });
  const [urlFile, setUrlFile] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  const openPdfModal = async (url: string) => {
    
    const pdfRes = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!pdfRes.ok) throw new Error("Gagal mengambil file PDF");

    const blob = await pdfRes.blob();
    const fileURL = URL.createObjectURL(blob);
    setSelectedPdfUrl(fileURL);
    setIsModalOpen(true);
  };

  const closePdfModal = () => {
    setSelectedPdfUrl(null);
    setIsModalOpen(false);
  };

  const getHistoryData = async () => {
    if (!token) {
      setIsLoading(false);
      setError("Autentikasi diperlukan. Silakan login kembali.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const historyRawData = await fetchSignatureHistory(token);
      const mappedData: DocumentSignatureHistory[] = historyRawData.map((item) => {
        const created_at = dayjs(item.created_at).format("YYYY-MM-DD");
        const updated_at = dayjs(item.updated_at).format("YYYY-MM-DD");
        return {
          id: item.id,
          createdBy: item.created_by,
          createdAt: created_at,
          updatedAt: updated_at,
          documentTypeName: item.template,
          documentVersion: item.version,
          description: item.description,
          signPriName: item.signer_record.filter((r) => r.is_primary)[0]?.name || "",
          signReceiverName: item.signer_record.filter((r) => !r.is_primary)[0]?.name || "",
          documentUrl: item.document,
        };
      });
      setTableData(mappedData);
    } catch (err: any) {
      console.error("Gagal memuat data histori:", err);
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, docName: string) => {
    if (!token) {
      toast.error("Autentikasi diperlukan.");
      return;
    }

    toast.warning(`Hapus Dokumen "${docName}"?`, {
      action: {
        label: "Ya, Hapus",
        onClick: async () => {
          try {
            setIsLoading(true);
            await deleteSignatureHistory(id);
            setTableData((prev) => prev.filter((item) => item.id !== id));
            toast.success(`"${docName}" dihapus.`);
          } catch (err: any) {
            toast.error(err.message || "Gagal menghapus.");
          } finally {
            setIsLoading(false);
          }
        },
      },
      cancel: { label: "Batal", onClick: () => {} },
      duration: 5000,
      id: `delete-${id}`,
    });
  };

  const handleSort = (key: keyof SignatureHistoryItem) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const sortedAndFilteredData = useMemo(() => {
    let currentData = [...tableData];

    if (filterText) {
      const lower = filterText.toLowerCase();
      currentData = currentData.filter((item) =>
        item.signReceiverName.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.documentTypeName.toLowerCase().includes(lower) ||
        item.createdBy.toLowerCase().includes(lower) ||
        item.createdAt.toLowerCase().includes(lower)
      );
    }

    return currentData;
  }, [tableData, sortConfig, filterText]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData.slice(start, start + itemsPerPage);
  }, [sortedAndFilteredData, currentPage]);

  useEffect(() => {
    getHistoryData();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, sortConfig]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Memuat data histori...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-48 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari dokumen..."
          value={filterText}
          onChange={handleFilterChange}
          className="pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    ["createdAt", "Dibuat Tanggal"],
                    ["description", "Deskripsi"],
                    ["createdBy", "Dibuat Oleh"],
                    ["signPriName", "Tanda Tangan Petugas"],
                    ["signReceiverName", "Nama Penerima"],
                    ["documentUrl", "Dokumen"],
                  ].map(([key, label]) => (
                    <TableCell
                      key={key}
                      isHeader
                      onClick={() => handleSort(key as keyof SignatureHistoryItem)}
                      className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortConfig.key === key && (
                          sortConfig.direction === "ascending" ? <ChevronUpIcon /> : <ChevronDownIcon />
                        )}
                      </div>
                    </TableCell>
                  ))}
                  <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.length > 0 ? (
                  paginatedData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">{order.createdAt}</TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">{order.description}</TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">{order.createdBy}</TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">{order.signPriName}</TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">{order.signReceiverName}</TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-blue-600 underline cursor-pointer">
                        <button onClick={() => openPdfModal(order.documentUrl)}>Lihat PDF</button>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Button
                          onClick={() => handleDelete(order.id, order.signReceiverName)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Tidak ada data yang cocok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <PdfModal isOpen={isModalOpen} onClose={closePdfModal} pdfUrl={selectedPdfUrl} />
    </>
  );
}
