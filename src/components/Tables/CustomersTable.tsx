'use client'

import { useEffect, useState } from "react";
import {useCustomers} from '@/hooks/useCustomersData';
import BaseTableNextUI from "./BaseTableNextUI";
import { ColumnType} from "@/types/tableTypes"
import { CustomerEntity } from "@/entities/customer/_domain/types";
import { useLogger } from "@/hooks/useLogger";


interface CustomersTableProps {
  companyId?: string;
}

const TableCustomer: React.FC<CustomersTableProps> = ({companyId })  => {
  const [linkValue, setLinkValue] = useState('');

  const[currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const[pageSize, setPageSize] = useState(20);
  const filter = companyId ? { companyId } : {};
  const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();

  const { customers, isLoading, error, total, fetchCustomers } = useCustomers({page:currentPage, pageSize:pageSize, filter:filter});
  const { logMessage } = useLogger();

  useEffect(() => { 

    fetchCustomers(complexFilterValue);
    setTotalPages(Math.ceil(total / pageSize));
  },[currentPage, pageSize, total, complexFilterValue]);

  useEffect(() =>{
    if (linkValue){
        logMessage(`Link fetched: ${linkValue}`)
    }    
  },[linkValue]);

  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};

const handleFilterSubmit = () => {
    setCurrentPage(1); 
    setComplexFilterValue(filterValue ? {"selectedFields": filterValue} :{"selectedFields": ""});
};
const handleLinkClick = (linkValue: string) => {
  setLinkValue(linkValue);
};

  const columns: ColumnType<CustomerEntity>[] = [
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
            isLoading={isLoading}
            error={error}
            filterValue={filterValue}
            routeName='/customer-card/'
            onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}
            onLinkClick={handleLinkClick}

        />
</div>
  );

};

export default TableCustomer;
