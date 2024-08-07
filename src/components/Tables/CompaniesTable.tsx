'use client';

import React, { useState, useEffect } from 'react';
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import BaseTable from './BaseTable';

interface CompaniesTableProps {
    customerId?: string;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ customerId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const pageSize = 10;
    let filter: any = {};

    if(customerId){
        filter = JSON.parse(`{"customerId": "${customerId}"}`);
    }
    const { companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies } = useCompanies(currentPage, pageSize, filter);

    useEffect(() => {
        fetchCompanies(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    }, [currentPage]);

    const totalPages = Math.ceil(totalCompanies / pageSize);

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

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    const handleFilterSubmit = () => {
        fetchCompanies(JSON.parse(`{"selectedFields":"${filterValue}"}`));
    };

    if (isLoadingCompanies) {
        return <Loader />;
    } 

    if (errorCompanies) {
        return <div>Error loading companies: {errorCompanies}</div>;
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'url', label: 'Url' },
        { key: 'size', label: 'Size' },
        { key: 'created_at', label: 'Created at' },
        { key: 'modified_at', label: 'Modified at' },
        { key: 'deleted_at', label: 'Deleted at' },
        { key: 'archived_at', label: 'Archived at' },
    ];

return (
    <div>
        <BaseTable
            data={companies}
            columns={[
                { key: 'name', label: 'Name' },
                { key: 'url', label: 'Url' },
                { key: 'size', label: 'Size' },
                { key: 'created_at', label: 'Created at' },
                { key: 'modified_at', label: 'Modified at' },
                { key: 'deleted_at', label: 'Deleted at' },
                { key: 'archived_at', label: 'Archived at' },
            ]}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoadingCompanies}
            error={errorCompanies}
            filterValue={filterValue}
            routeName='/company-card/'
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}


        />
    </div>
);

};

export default CompaniesTable;
