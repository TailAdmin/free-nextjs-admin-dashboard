'use client';

import React, { useState, useEffect } from 'react';
import BaseTableNextUI from './BaseTableNextUI';
import { ColumnType} from "@/types/tableTypes"
import { AccountEntity } from '@/entities/account/_domain/types';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useFilter } from '../Navbar/filter-context';

const AccountsTable = () => {
    const [linkValue, setLinkValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);
    //const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
    const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);

    const {complexFilterValue, setShowFilters, handleContextInit} = useFilter();

    let filter: any = {};
// settings for global filter context
    useEffect(() => {

        if (setShowFilters)
            {setShowFilters(true);}

        return () => {
            if (setShowFilters)
            {setShowFilters(false);}
            if (handleContextInit) {
                handleContextInit();
            }
        };
        }, [setShowFilters]);

    //const { accounts, isLoading, error, total, fetchAccounts } = useAccounts({page: currentPage, pageSize: pageSize, filter: filter});
    const { data: accounts, isLoading, error, total, fetchData } = useDataFetcher<AccountEntity>({
        endpoint: API_ENDPOINTS.ACCOUNTS, 
        page: currentPage,
        pageSize: pageSize,
        filter: filter
    }); 

    
    const { logMessage } = useLogger();
    useEffect(() => {
        fetchData(complexFilterValue);
        setTotalPages(Math.ceil(total / pageSize));
    }, [currentPage, pageSize, total, complexFilterValue]);

    useEffect(() =>{
        if (linkValue){
            logMessage(`Link fetched: ${linkValue}`)
        }    
    },[linkValue]);

//     const handleFilterChange = (filterValue: string) => {
//         setFilterValue(filterValue);
//     };



//     const handleFilterSubmit = () => {
//         setCurrentPage(1); 

// // store the current text filter     
//     const filterFields = {
//         selectedFields: filterValue || "", 
//         created_at: dateRangeValue ? dateRangeValue : ["", ""] 
//     };   
//     //setComplexFilterValue(filterFields);

//     };
    const handleLinkClick = (linkValue: string) => {
        setLinkValue(linkValue);
    };

    // const handleDateRangeChange = (dateRangeValue: string[]|null) => {
    //     setDateRangeValue(dateRangeValue)
    // };

    const columns: ColumnType<AccountEntity>[] = [
        { key: 'company_name', label: 'Company Name', link_type: 'external', link: 'company_link' },
        { key: 'vefified_by_customer_name', label: 'Verified By Customer', link_type: 'internal', link: (row) => `/customer-card/${row.vefified_by_customer_id}` },
        { key: 'edited_by_customer_name', label: 'Edited By Customer', link_type: 'internal', link: (row) => `/customer-card/${row.edited_by_customer_id}` },
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
            routeName='/account-card/'
            filterValue={filterValue}
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            //onFilterChange={handleFilterChange}
            //onFilterSubmit={handleFilterSubmit}
            onLinkClick={handleLinkClick}
            isDateRange={true}
            dateRangeValue={dateRangeValue}
            //onSetDateRangeValue={handleDateRangeChange}


        />
    </div>
);

};

export default AccountsTable;
