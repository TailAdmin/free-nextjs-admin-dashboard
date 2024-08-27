'use client';

import React, { useState, useEffect } from 'react';
import { useCompanies } from '@/hooks/useCompaniesData';
import BaseTableNextUI from './BaseTableNextUI';
import { ColumnType} from "@/types/tableTypes"
import { CompanyEntity } from '@/entities/company/_domain/types';

interface CompaniesTableProps {
    customerId?: string;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ customerId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);
    const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();


    const filter = customerId ? {customerId} : {} 

    const { companies, isLoading, error, total, fetchCompanies } = useCompanies({page: currentPage, pageSize: pageSize, filter: filter});

    useEffect(() => {
        fetchCompanies(complexFilterValue);
        setTotalPages(Math.ceil(total / pageSize));
    }, [currentPage, pageSize, total, complexFilterValue]);


    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };

    const handleFilterSubmit = () => {
        setCurrentPage(1); 
        setComplexFilterValue(filterValue ? {"selectedFields": filterValue} :{"selectedFields": ""});
    
    };

    const columns: ColumnType<CompanyEntity>[] = [
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
            isLoading={isLoading}
            error={error}
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
