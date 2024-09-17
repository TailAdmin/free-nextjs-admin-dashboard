'use client';

import React, { useState, useEffect } from 'react';
import BaseTableNextUI from './BaseTableNextUI';
import {ColumnType} from "@/types/tableTypes"
import { GameEntity } from '@/entities/game/_domain/types';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useFilter } from '../Navbar/filter-context';

interface GamesTableProps {
    customerId?: string;
    companyId?: string;
}

const GamesTable: React.FC<GamesTableProps> = ({ customerId, companyId }) => {
    const [linkValue, setLinkValue] = useState('');
    //const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const[pageSize, setPageSize] = useState(20);
    const [filterValue, setFilterValue] = useState('');
    //const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
    const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
    
    const {complexFilterValue, setShowFilters, handleContextInit, currentPage} = useFilter();    
    const [filter, setFilter] = useState(companyId ? {companyId} : customerId ? {customerId} : {})
 
    const { data: games, isLoading, error, total, fetchData } = useDataFetcher<GameEntity>();    
    const { logMessage } = useLogger();
 
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
        }, []);

        useEffect(() => {
            fetchData({
                    endpoint:API_ENDPOINTS.GAMES, 
                    page:currentPage,
                    pageSize:pageSize,
                    selectedFilterValue:{...complexFilterValue, ...filter}});
    
        }, [currentPage, pageSize, complexFilterValue, filter]);
    
        useEffect(() => {
    
            setTotalPages(Math.ceil(total / pageSize));
        
        },[total, pageSize]);



    useEffect(() =>{
        if (linkValue){
            logMessage(`Link fetched: ${linkValue}`)
        }    
    },[linkValue]);

    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue);
    };
    
    const handleFilterSubmit = () => {
        //setCurrentPage(1); 
        const filterFields = {
            selectedFields: filterValue || "", 
            created_at: dateRangeValue ? dateRangeValue : ["", ""] 
        };   
        //setComplexFilterValue(filterFields);
        

    };

    const handleLinkClick = (linkValue: string) => {
        setLinkValue(linkValue);
    };
    
    const handleDateRangeChange = (dateRangeValue: string[]|null) => {
        setDateRangeValue(dateRangeValue)
    };

    const columns: ColumnType<GameEntity>[] = [
        { key: 'name', label: 'Name' },
        { key: 'company_name', label: 'Company name', link_type: 'external',link: 'company_link' },
        { key: 'created_at', label: 'Created at' },


    ];

    return (
        <div>
            <BaseTableNextUI
                data={games}
                columns={columns}
                //currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                isLoading={isLoading}
                error={error}
                filterValue={filterValue}
                routeName='/game-card/'
                //onSetPageNumber={setCurrentPage}
                onSetPageSize={setPageSize}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onLinkClick={handleLinkClick}
                isDateRange={true}
                dateRangeValue={dateRangeValue}
                onSetDateRangeValue={handleDateRangeChange}

            />
        </div>
    );
    
    
};

export default GamesTable;
