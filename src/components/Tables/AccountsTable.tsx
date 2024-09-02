'use client';

import React, { useState, useEffect } from 'react';
import { useAccounts } from '@/hooks/useAccountsData';
import BaseTableNextUI from './BaseTableNextUI';
import { ColumnType} from "@/types/tableTypes"
import { AccountEntity } from '@/entities/account/_domain/types';
import { useLogger } from '@/hooks/useLogger';


const AccountsTable = () => {
    const [linkValue, setLinkValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);
    const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();

    let filter: any = {};


    const { accounts, isLoading, error, total, fetchAccounts } = useAccounts({page: currentPage, pageSize: pageSize, filter: filter});
    const { logMessage } = useLogger();
    useEffect(() => {
        fetchAccounts(complexFilterValue);
        setTotalPages(Math.ceil(total / pageSize));
    }, [currentPage, pageSize, total, complexFilterValue]);

    useEffect(() =>{
        if (linkValue){
            logMessage(`Link fetched: ${linkValue}`)
        }    
    },[linkValue]);

    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };



    const handleFilterSubmit = () => {
        setCurrentPage(1); 

// store the current text filter        
        setComplexFilterValue(filterValue ? {"selectedFields": filterValue} :{"selectedFields": ""});

    };
    const handleLinkClick = (linkValue: string) => {
        setLinkValue(linkValue);
    };

    const columns: ColumnType<AccountEntity>[] = [
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
            onLinkClick={handleLinkClick}


        />
    </div>
);

};

export default AccountsTable;
