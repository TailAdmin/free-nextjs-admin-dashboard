'use client';

import React, { useState, useEffect } from 'react';
import { useAccounts } from '@/hooks/useAccountsData';
import Loader from '../common/Loader';
import BaseTableNextUI from './BaseTableNextUI';
import {LinkType} from "@/types/linkTypes"


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

    const columns: { key: string; label: string; link_type?: LinkType; link?: string|((row: any) => string)  }[] = [
       
        { key: 'company_name', label: 'Company Name', link_type: 'external', link: 'company_link' },
        { key: 'vefified_by_customer_name', label: 'Verified By Customer', link_type: 'internal', link: (row) => `/customer-card/${row.vefified_by_customer_id}` },
        { key: 'edited_by_customer_name', label: 'Edited By Customer', link_type: 'internal', link: (row) => `/customer-card/${row.edited_by_customer_id}` },
        { key: 'verify_state', label: 'Verify state' },
        { key: 'verified_at', label: 'Verified at' },
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
            routeName='/account-card/'
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
