'use client'

import { useEffect, useState } from "react";
import BaseTableNextUI from "./BaseTableNextUI";
import { ColumnType} from "@/types/tableTypes"
import { UserEntity } from "@/entities/user/_domain/types";
import { useLogger } from "@/hooks/useLogger";
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useFilter } from "../Navbar/filter-context";



const TableUser = ()  => {
  const [linkValue, setLinkValue] = useState('');

  //const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  //const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
  const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
  const {complexFilterValue, setShowFilters, handleContextInit, currentPage} = useFilter();
  const { data, isLoading, error, total, fetchData } = useDataFetcher<UserEntity>(); 
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
    }, [setShowFilters]);

    useEffect(() => {
      fetchData({
              endpoint:API_ENDPOINTS.PLAYERS, 
              page:currentPage,
              pageSize:pageSize,
              selectedFilterValue:complexFilterValue});
  
  }, [currentPage, pageSize, complexFilterValue]);
  
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
  }
    
const handleLinkClick = (linkValue: string) => {
  setLinkValue(linkValue);
};

const handleDateRangeChange = (dateRangeValue: string[]|null) => {
  setDateRangeValue(dateRangeValue)
};

  const columns: ColumnType<UserEntity>[] = [

    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-mail' },
    { key: 'company_name', label: 'Company Name', link_type: 'external', link: 'company_link' },
    { key: 'game_name', label: 'Game Name', link_type: 'external', link: 'game_link' },
    { key: 'created_at', label: 'Created at' },
  ];


  return (
  <div>
        <BaseTableNextUI
            data={data}
            columns={columns}
            //currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            isDateRange={true}
            filterValue={filterValue}
            routeName='/player-card/'
            //onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}
            onLinkClick={handleLinkClick}
            dateRangeValue={dateRangeValue}
            onSetDateRangeValue={handleDateRangeChange}

        />
</div>
  );

};

export default TableUser;
