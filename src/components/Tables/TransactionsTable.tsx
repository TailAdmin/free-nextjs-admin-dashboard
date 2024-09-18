'use client'

import { useEffect, useState } from "react";
import BaseTableNextUI from "./BaseTableNextUI";
import { ColumnType} from "@/types/tableTypes"
import { TransactionEntity } from "@/entities/transaction/_domain/types";
import { useLogger } from "@/hooks/useLogger";
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useFilter } from "../Navbar/filter-context";

const TableTransaction = () => {

  const [linkValue, setLinkValue] = useState('');
  //const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValue, setFilterValue] = useState('');
//  const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
  const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
  const { logMessage } = useLogger();

  const {complexFilterValue, setShowFilters, handleContextInit, currentPage} = useFilter();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {

    if (setShowFilters)
      {setShowFilters(true);}
    if (handleContextInit) {
      handleContextInit();
  }

    return () => {
      if (setShowFilters)
        {setShowFilters(false);}
      if (handleContextInit) {
        handleContextInit();
      }
    };
  }, []);

  const { data: transactions, isLoading, error, total, fetchData } = useDataFetcher<TransactionEntity>(); 
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!initialized) {
      timeoutId = setTimeout(() => setInitialized(true), 100);  
    }else{
      fetchData({
              endpoint:API_ENDPOINTS.TRANSACTIONS, 
              page:currentPage,
              pageSize:pageSize,
              selectedFilterValue:complexFilterValue});
    }          

}, [initialized, currentPage, pageSize, complexFilterValue]);

useEffect(() => {

    setTotalPages(Math.ceil(total / pageSize));

},[total]);

useEffect(() =>{
  if (linkValue){
      logMessage(`Link fetched: ${linkValue}`)
  }    
},[linkValue]);


const handleDateRangeChange = (dateRangeValue: string[]|null) => {
  setDateRangeValue(dateRangeValue)
};


  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};
const handleLinkClick = (linkValue: string) => {
  setLinkValue(linkValue);
};


  const handleFilterSubmit = () => {
    //setCurrentPage(1); 
    const filterFields = {
      selectedFields: filterValue || "", 
      payment_date: dateRangeValue ? dateRangeValue : ["", ""] 
    };
    //setComplexFilterValue(filterFields);
  
  };

  

  const columns: ColumnType<TransactionEntity>[] = [
    { key: 'payment_number', label: 'Payment number', link_type: "external",link: 'payment_link' },
    { key: 'payment_date', label: 'Payment date'},
    { key: 'billing_email', label: 'Billing Email'},
    { key: 'status', label: 'Status', cellColor: (row)=>{

      if (row.status === 'done') return '#BBF7D0';
      if (['canceled', 'rejected', 'failed'].includes(row.status)) return '#FECACA';
      if (row.status === 'refunded') return '#DDD6FE';

      return '#F1F5F9';
    } },
    { key: 'amountWithCurrency', label: 'Amount' },
    //{ key: 'company_name', label: 'Company Name', link_type: "external", link: 'company_link' },
    { key: 'ip', label: 'IP Address'},
    { key: 'game_name', label: 'Game Name', link_type: "external", link: 'game_link' },
  
    { key: 'user_id', label: 'User ID' },
    // { key: 'user_name', label: 'User Name' },
    // { key: 'player_id', label: 'Player ID' },
    // { key: 'player_name', label: 'Player Name' },
    { key: 'item_name', label: 'Item name' },


    { key: 'country', label: 'Country' },

  
];

  return (

    <div>
        <BaseTableNextUI
            data={transactions}
            columns={columns}
            totalValue={total}
            //currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            isLoading={isLoading}
            error={error}
            filterValue={filterValue}
            isDateRange={true}
            dateRangeValue={dateRangeValue}
            onSetDateRangeValue={handleDateRangeChange}
            //onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}
            onLinkClick={handleLinkClick}

        />
</div>


  );
};

export default TableTransaction;
