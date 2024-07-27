'use client'

import Image from "next/image";
import { useState } from "react";
import {useCustomers} from '@/hooks/useCustomersData';
import Loader from "../common/Loader";
import { CustomerEntity } from "@/entities/customer/_domain/types";
import CustomerCard from "../Cards/CustomerCard";
import CustomerDetailForm from "../Cards/CustomerCard";

const TableCustomer = () => {


  const[currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerEntity|null>(null);
  const { customers, isLoading, error, total } = useCustomers(currentPage, pageSize);


  const totalPages = Math.ceil(total / pageSize);

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

  if (error) {
    return <div>Error loading customers {error}</div>; 
  }

  if (isLoading) {
    return <Loader /> ;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-mail' },
    { key: 'is_staff', label: 'Is Staff' },
    { key: 'created_at', label: 'Created at' },
    { key: 'last_login_at', label: 'Last login at' },
    { key: 'accepted_privacy_version', label: 'Accepted privacy version' },
    { key: 'accepted_terms_version', label: 'Accepted terms version' },
  ];

  const calculateColumnWidth = (key: keyof CustomerEntity) => {
    const maxLength = Math.max(
      ...customers.map(customer => {
        const value = customer[key];
        return value ? value.toString().length - 20 : 10;
      })
    );
    return `${maxLength }ch`;
  };


  const handleRowClick = (customer: CustomerEntity) => {
    setSelectedCustomer(customer);
  };

  const handleCloseCard = () => {
    setSelectedCustomer(null);
  };


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Customers
      </h4>

      <div className="flex flex-col">
      <div className="overflow-x-auto">
      <div className="min-w-[1250px]">
        <div className="flex bg-gray-2 dark:bg-meta-4">
          
        {columns.map((column) => (
                <div 
                  key={column.key} className="p-2.5 xl:p-5 overflow-hidden text-ellipsis" 
                  style={{ minWidth: calculateColumnWidth(column.key as keyof CustomerEntity) }}>
                  
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    {column.label}
                  </h5>
                </div>
              ))}

        </div>

        {customers.map((customer, key) => (
          <div
            className={`flex ${
              key === customers.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
            onClick={() => handleRowClick(customer)}
          >

                {columns.map((column) => (
                  <div 
                    key={column.key} className="flex items-center justify-center p-2.5 xl:p-5 overflow-hidden text-ellipsis whitespace-nowrap" 
                    style={{ minWidth: calculateColumnWidth(column.key) }}>
                    
                    <p className="text-black dark:text-white break-words">{customer[column.key]}</p>
                  </div>
                ))}
          </div>
        ))}

        </div>
        </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>  

      </div>

      {selectedCustomer && (
        <CustomerDetailForm customer={selectedCustomer} onClose={handleCloseCard} />
      )}


    </div>
  );
};

export default TableCustomer;
