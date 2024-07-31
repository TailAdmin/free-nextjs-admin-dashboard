'use client';

import React, { useState, useEffect } from 'react';
import { CompanyEntity } from "@/entities/company/_domain/types";
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import Link from 'next/link';

interface CompaniesTableProps {
    customerId?: string;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ customerId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    let filter: any = {};

    if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies } = useCompanies(currentPage, pageSize, filter);

    useEffect(() => {
        fetchCompanies();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCompanies / pageSize);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    if (isLoadingCompanies) {
        return <Loader />;
    }

    if (errorCompanies) {
        return <div>Error loading companies: {errorCompanies}</div>;
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'url', label: 'Url' },
        { key: 'size', label: 'Size' },
        { key: 'created_at', label: 'Created at' },
        { key: 'modified_at', label: 'Modified at' },
        { key: 'deleted_at', label: 'Deleted at' },
        { key: 'archived_at', label: 'Archived at' },
    ];

    return (

    <div>
        <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
        <thead>
            <tr>

                {columns.map((column) => (
                <th className="border border-gray-200 p-2 min-w-[150px]"
                    key={column.key}
                >
                    {column.label}
                </th>
                ))}


            </tr>
        </thead>
        <tbody>
    {companies.map((company: CompanyEntity, keyRow) => (
     
            <tr key={company.id} className="cursor-pointer hover:bg-gray-100">
                
                {columns.map((column) => (
                    <td className="border border-gray-200 p-2 min-w-[150px]" key={column.key}>
                        <Link href={`/company-card/${company.id}`}>
                        <p className="text-black dark:text-white">
                            {company[column.key]}
                        </p>
                        </Link>
                    </td>
                ))}
                 
            </tr>
       
    ))}
</tbody>
        </table>
        <div className="flex justify-between mt-4">
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
            >
                Previous
            </button>
                <span className="self-center">
                    Page {currentPage} of {totalPages}
                </span>
            <button
                onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
        </div>
    </div>
    );
};

export default CompaniesTable;
