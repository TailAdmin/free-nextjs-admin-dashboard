'use client';

import React, { useState, useEffect } from 'react';
import { useGames } from '@/hooks/useGamesData';
import BaseTableNextUI from './BaseTableNextUI';
import {ColumnType} from "@/types/tableTypes"
import { GameEntity } from '@/entities/game/_domain/types';

interface GamesTableProps {
    customerId?: string;
    companyId?: string;
}

const GamesTable: React.FC<GamesTableProps> = ({ customerId, companyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);
    const [filterValue, setFilterValue] = useState('');
    const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
    let filter: any = {};
    
    if(companyId){
        filter = JSON.parse(`{"companyId": "${companyId}"}`);
    }else if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { games, isLoading, error, total, fetchGames } = useGames({page: currentPage, pageSize: pageSize, filter: filter});

    useEffect(() => {
        fetchGames(complexFilterValue);
        setTotalPages(Math.ceil(total / pageSize));
    }, [currentPage, pageSize, total, complexFilterValue]);

    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };
    
    const handleFilterSubmit = () => {
        setCurrentPage(1); 
        setComplexFilterValue(filterValue ? {"selectedFields": filterValue} :{"selectedFields": ""})

    };
    

    const columns: ColumnType<GameEntity>[] = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'url', label: 'Url', link_type: 'external', link: 'url' },
        { key: 'company_name', label: 'Company name', link_type: 'external',link: 'company_link' },
        { key: 'login_type', label: 'Login type' },
        { key: 'created_at', label: 'Created at' },
        { key: 'modified_at', label: 'Modified at' },

    ];

    return (
        <div>
            <BaseTableNextUI
                data={games}
                columns={columns}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                isLoading={isLoading}
                error={error}
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
