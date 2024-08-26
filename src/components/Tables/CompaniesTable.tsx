'use client';

import React, { useState, useEffect } from 'react';
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import BaseTableNextUI from './BaseTableNextUI';
import {LinkType} from "@/types/linkTypes";

interface CompaniesTableProps {
    customerId?: string;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ customerId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);

    let filter: any = {};

    if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies } = useCompanies(currentPage, pageSize, filter);

    useEffect(() => {
        fetchCompanies(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    }, [currentPage, pageSize]);

    useEffect(() => {

        setTotalPages(Math.ceil(totalCompanies / pageSize));
    }, [totalCompanies, pageSize]);


    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };



    const handleFilterSubmit = () => {
        setCurrentPage(1); 
        fetchCompanies(JSON.parse(`{"selectedFields":"${filterValue}"}`));

    };

    if (isLoadingCompanies) {
        return <Loader />;
    } 

    if (errorCompanies) {
        return <div>Error loading companies: {errorCompanies}</div>;
    }

    const columns: { key: string; label: string; link_type?: LinkType; link?: string|((row: any) => string)  }[] = [
        { key: 'name', label: 'Name', link_type: 'external', link: 'company_link' },
        { key: 'created_at', label: 'Created at' },
    ];

return (
    <div>
        <BaseTableNextUI
            data={companies}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoadingCompanies}
            error={errorCompanies}
            filterValue={filterValue}
            routeName='/company-card/'
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}


        />
    </div>
);

};

export default CompaniesTable;
