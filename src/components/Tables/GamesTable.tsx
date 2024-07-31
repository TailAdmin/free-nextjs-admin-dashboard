'use client';

import React, { useState, useEffect } from 'react';
import { GameEntity } from "@/entities/game/_domain/types";
import { useGames } from '@/hooks/useGamesData';
import Loader from '../common/Loader';
import { Json } from '@google-cloud/bigquery';

interface GamesTableProps {
    customerId?: string;
    companyId?: string;
}

const GamesTable: React.FC<GamesTableProps> = ({ customerId, companyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    let filter: any = {};

    if(companyId){
        filter = JSON.parse(`{"companyId": "${companyId}"}`);
    }else if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { games, isLoadingGames, errorGames, totalGames, fetchGames } = useGames(currentPage, pageSize, filter);

    useEffect(() => {
        fetchGames();
    }, [currentPage]);

    const totalPages = Math.ceil(totalGames / pageSize);

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

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'url', label: 'Url' },
        { key: 'login_type', label: 'Login type' },
        { key: 'created_at', label: 'Created at' },
        { key: 'modified_at', label: 'Modified at' },
        { key: 'deleted_at', label: 'Deleted at' },
        { key: 'archived_at', label: 'Archived at' },
    ];


    if (isLoadingGames) {
        return <Loader />;
    }

    if (errorGames) {
        return <div>Error loading games: {errorGames}</div>;
    }

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

                        {games.map((game: GameEntity) => (
                            <tr key={game.id}>
                                {columns.map((column) => (
                                    <td className="border border-gray-200 p-2 min-w-[150px]"
                                        key={column.key}
                                    >
                                        <p className="text-black dark:text-white">
                                            {game[column.key]}
                                        </p>
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

export default GamesTable;
