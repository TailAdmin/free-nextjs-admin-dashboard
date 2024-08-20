'use client'

import { useEffect, useState } from "react";
import {useCustomers} from '@/hooks/useCustomersData';
import Loader from "../common/Loader";
import BaseTableNextUI from "./BaseTableNextUI";


interface CustomersTableProps {
  companyId?: string;
}

const TableCustomer: React.FC<CustomersTableProps> = ({companyId })  => {


  const[currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const[pageSize, setPageSize] = useState(10);
  let filter: any = {};

  if(companyId){
      filter = JSON.parse(`{"companyId": "${companyId}"}`);
  }

  const { customers, isLoadingCustomers, errorCustomers, totalCustomers, fetchCustomers } = useCustomers(currentPage, pageSize, filter);
  

  useEffect(() => { 

    fetchCustomers(JSON.parse(`{"selectedFields":"${filterValue}"}`));

  },[currentPage, pageSize]);


  useEffect(() => {

    setTotalPages(Math.ceil(totalCustomers / pageSize));
}, [totalCustomers, pageSize]);

  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};

const handleFilterSubmit = () => {
    setCurrentPage(1); 
    fetchCustomers(JSON.parse(`{"selectedFields":"${filterValue}"}`));
};

  if (errorCustomers) {
    return <div>Error loading customers {errorCustomers}</div>; 
  }

  if (isLoadingCustomers) {
    return <Loader /> ;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-mail' },
    { key: 'is_staff', label: 'Is Staff' },
    { key: 'created_at', label: 'Created at' },
  ];


  return (
  <div>
        <BaseTableNextUI
            data={customers}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoadingCustomers}
            error={errorCustomers}
            filterValue={filterValue}
            routeName='/customer-card/'
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}

        />
</div>
  );

};

export default TableCustomer;
