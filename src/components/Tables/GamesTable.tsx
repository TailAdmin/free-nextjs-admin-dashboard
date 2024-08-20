'use client';

import React, { useState, useEffect } from 'react';
import { useGames } from '@/hooks/useGamesData';
import Loader from '../common/Loader';
import BaseTableNextUI from './BaseTableNextUI';

interface GamesTableProps {
    customerId?: string;
    companyId?: string;
}

const GamesTable: React.FC<GamesTableProps> = ({ customerId, companyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(10);
    const [filterValue, setFilterValue] = useState('');
    let filter: any = {};
    
    if(companyId){
        filter = JSON.parse(`{"companyId": "${companyId}"}`);
    }else if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { games, isLoadingGames, errorGames, totalGames, fetchGames } = useGames(currentPage, pageSize, filter);

    useEffect(() => {
        fetchGames(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    }, [currentPage, pageSize]);

    useEffect(() => {

        setTotalPages(Math.ceil(totalGames / pageSize));
    }, [totalGames, pageSize]);

    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };
    
    const handleFilterSubmit = () => {
        setCurrentPage(1); 
        fetchGames(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    };
    

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'url', label: 'Url' },
        { key: 'company_name', label: 'Company name' },
        { key: 'login_type', label: 'Login type' },
        { key: 'created_at', label: 'Created at' },
        { key: 'modified_at', label: 'Modified at' },

    ];


    if (isLoadingGames) {
        return <Loader />;
    }

    if (errorGames) {
        return <div>Error loading games: {errorGames}</div>;
    }

    return (
        <div>
            <BaseTableNextUI
                data={games}
                columns={columns}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                isLoading={isLoadingGames}
                error={errorGames}
                filterValue={filterValue}
                onSetPageNumber={setCurrentPage}
                onSetPageSize={setPageSize}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}

            />
        </div>
    );
    
    
};

export default GamesTable;
