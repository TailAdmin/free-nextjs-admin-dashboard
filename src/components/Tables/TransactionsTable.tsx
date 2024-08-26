'use client'

import { useEffect, useState } from "react";
import {useTransactions} from '@/hooks/useTransactions';
import Loader from "../common/Loader";
import BaseTableNextUI from "./BaseTableNextUI";
import {LinkType} from "@/types/linkTypes"

const TableTransaction = () => {


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValue, setFilterValue] = useState('');
  const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
  const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
  const { transactions, isLoading, error, total, fetchTransactions} = useTransactions(currentPage, pageSize);

  useEffect(() =>{

    fetchTransactions(complexFilterValue);
  },[currentPage, pageSize, complexFilterValue])

  useEffect(() => {

    setTotalPages(Math.ceil(total / pageSize));
}, [total, pageSize]);


const handleDateRangeChange = (dateRangeValue: string[]|null) => {
  setDateRangeValue(dateRangeValue)
};


  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};


  const handleFilterSubmit = () => {
    setCurrentPage(1); 
    const filterFields = {
      selectedFields: filterValue || "", 
      payment_date: dateRangeValue ? dateRangeValue : ["", ""] 
  };
    setComplexFilterValue(filterFields);
  
    //fetchTransactions(filterFields);
  };

  const columns: { key: string; label: string; link_type?: LinkType; link?: string|((row: any) => string)  }[] = [
    { key: 'payment_number', label: 'Payment number', link_type: "external",link: 'payment_link' },
    { key: 'payment_date', label: 'Payment date'},
    { key: 'billing_email', label: 'Billing Email'},
    { key: 'status', label: 'Status' },
    { key: 'amountWithCurrency', label: 'Amount' },
    { key: 'company_name', label: 'Company Name', link_type: "external", link: 'company_link' },
    { key: 'game_name', label: 'Game Name', link_type: "external", link: 'game_link' },
  
    { key: 'user_id', label: 'User ID' },
    { key: 'user_name', label: 'User Name' },
    { key: 'player_name', label: 'Player Name' },
    { key: 'item_name', label: 'Item name' },


    { key: 'country', label: 'Country' },

  
];

  if (error) {
    return <div>Error loading customers {error}</div>; 
  }

  if (isLoading) {
    return <Loader /> ;
  }


  return (

    <div>
        <BaseTableNextUI
            data={transactions}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            isLoading={isLoading}
            error={error}
            filterValue={filterValue}
            isDateRange={true}
            dateRangeValue={dateRangeValue}
            onSetDateRangeValue={handleDateRangeChange}
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}

        />
</div>


  );
};

export default TableTransaction;
