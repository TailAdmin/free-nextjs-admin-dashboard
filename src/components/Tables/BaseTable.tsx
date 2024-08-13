'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Loader from '../common/Loader';
import Link from 'next/link';

interface BaseTableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    filterValue: string;
    routeName?: string;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFilterSubmit: () => void;
 
}

const BaseTable = <T extends Record<string, any>>({
    data,
    columns,
    currentPage,
    totalPages,
    filterValue,
    isLoading,
    error,
    routeName = "none",
    onNextPage,
    onPreviousPage,
    onFilterChange,
    onFilterSubmit,

}: BaseTableProps<T>) => {

    // const [filterValue, setFilterValue] = useState('');

    // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFilterValue(e.target.value);
    // };

    // const handleFilterSubmit = () => {
    //     onFilterChange({ selectedFields: filterValue });
    //     fetchData({ selectedFields: filterValue });
    // };

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Type filter..."
                    value={filterValue}
                    onChange={onFilterChange}
                    className="px-4 py-2 border rounded"
                />
                <button onClick={onFilterSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Apply Filter
                </button>
            </div>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <div>Error loading data: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={String(column.key)} className="border border-gray-200 p-2 min-w-[150px]">
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="cursor-pointer hover:bg-gray-100">
                                    {columns.map((column) => (
                                        <td key={String(column.key)} className="border border-gray-200 p-2 min-w-[150px]">
                                            {routeName === "none" ? (
                                                <p className="text-black dark:text-white">{row[column.key] as unknown as ReactNode}</p>)
                                                :
                                            (<Link href={`${routeName}${row['id']}`}>
                                                <p className="text-black dark:text-white">{row[column.key] as unknown as ReactNode}</p>
                                            </Link>)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={onPreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="self-center">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={onNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseTable;
