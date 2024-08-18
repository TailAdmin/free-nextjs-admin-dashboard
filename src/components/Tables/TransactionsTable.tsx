'use client'

import { useEffect, useState } from "react";
import {useTransactions} from '@/hooks/useTransactions';
import Loader from "../common/Loader";
import BaseTableNextUI from "./BaseTableNextUI";

const TableTransaction = () => {


  const[currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const[pageSize, setPageSize] = useState(20);
  const [filterValue, setFilterValue] = useState('');
  const { transactions, isLoading, error, total, fetchTransactions} = useTransactions(currentPage, pageSize);

  useEffect(() =>{
    fetchTransactions(JSON.parse(`{"selectedFields":"${filterValue}"}`));
  },[currentPage, pageSize])

  useEffect(() => {

    setTotalPages(Math.ceil(total / pageSize));
}, [total, pageSize]);

  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};


  const handleFilterSubmit = () => {
    setCurrentPage(1); 
    fetchTransactions(JSON.parse(`{"selectedFields":"${filterValue}"}`));
  };

  const columns = [
    { key: 'payment_number', label: 'Payment number' },
    { key: 'payment_date', label: 'Payment date'},
    { key: 'billing_email', label: 'Billing Email'},
    { key: 'status', label: 'Status' },
    { key: 'amountWithCurrency', label: 'Amount' },
    { key: 'company_name', label: 'Company Name' },
    { key: 'game_name', label: 'Game Name' },
    
    { key: 'company_id', label: 'Company ID' },
    { key: 'game_id', label: 'Game ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'user_name', label: 'User Name' },
    { key: 'player_name', label: 'Player Name' },
    { key: 'item_name', label: 'Item name' },


    { key: 'country', label: 'Country' },
    { key: 'order_id', label: 'Order ID' },
    { key: 'status_order', label: 'Status order' },
  
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
            isLoading={isLoading}
            error={error}
            filterValue={filterValue}
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}

        />
</div>


  );
};

export default TableTransaction;
