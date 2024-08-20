'use client';

import React, { useState, useEffect } from 'react';
import { useAccounts } from '@/hooks/useAccountsData';
import Loader from '../common/Loader';
import BaseTableNextUI from './BaseTableNextUI';


const AccountsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);

    let filter: any = {};


    const { accounts, isLoading, error, total, fetchAccounts } = useAccounts(currentPage, pageSize, filter);

    useEffect(() => {
        fetchAccounts(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    }, [currentPage, pageSize]);

    useEffect(() => {

        setTotalPages(Math.ceil(total / pageSize));
    }, [total, pageSize]);


    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };



    const handleFilterSubmit = () => {
        setCurrentPage(1); 
        fetchAccounts(JSON.parse(`{"selectedFields":"${filterValue}"}`));

    };

    if (isLoading) {
        return <Loader />;
    } 

    if (error) {
        return <div>Error loading companies: {error}</div>;
    }

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'details', label: 'Details' },
        { key: 'details_version', label: 'Details version' },
        { key: 'verify_state', label: 'Verify state' },
        { key: 'verified_at', label: 'Verified at' },
        { key: 'created_at', label: 'Created at' },
    ];

return (
    <div>
        <BaseTableNextUI
            data={accounts}
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

export default AccountsTable;
