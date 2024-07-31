'use client';

import React, { useEffect, useState } from 'react';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import Loader from '../common/Loader';
import { useCustomers } from '@/hooks/useCustomersData';
import CompaniesTable from '../Tables/CompaniesTable';
import GamesTable from '../Tables/GamesTable';

interface CustomerDetailFormProps {
  customerId?: string;
  companyId?: string;
}

const CustomerDetailForm: React.FC<CustomerDetailFormProps> = ({ customerId, companyId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[currentPage, setCurrentPage] = useState(1);
    const[customer, setCustomer] = useState<CustomerEntity|null>(null);
    const pageSize = 1;
    let filter: Record<string, any> = {};
    if (customerId){
      filter = JSON.parse(`{"customerId":"${customerId}"}`);
    }else if(companyId){

      filter = JSON.parse(`{"companyId":"${companyId}"}`);
    }
    const {customers, isLoadingCustomers, errorCustomers, fetchCustomers} = useCustomers(currentPage, pageSize, filter);
    
    useEffect(() => {

            fetchCustomers();

    },[]);

    useEffect(() => {
      if (customers.length > 0) {
        setCustomer(customers[0]);
      }
    }, [customers]);


    if (errorCustomers ) {
      return <div>Error loading {errorCustomers}</div>; 
    }

    if (!customer) {
    return null;
    }
    if (isLoadingCustomers) {
      return <Loader /> ;
    } 
    const renderTabContent = () => {
    switch (activeTab) {
        case 'details':
        return (
            <div> 
            <label className="block text-sm font-medium text-black">Name:</label>
            <p className="mb-4">{customer.name}</p>

            <label className="block text-sm font-medium text-black">Email:</label>
            <p className="mb-4">{customer.email}</p>

            <label className="block text-sm font-medium text-black">Is Staff:</label>
            <p className="mb-4">{customer.is_staff ? 'Yes' : 'No'}</p>

            <label className="block text-sm font-medium text-black">Created At:</label>
            <p className="mb-4">{customer.created_at}</p>

            <label className="block text-sm font-medium text-black">Last Login At:</label>
            <p className="mb-4">{customer.last_login_at}</p>

            <label className="block text-sm font-medium text-black">Accepted Privacy Version:</label>
            <p className="mb-4">{customer.accepted_privacy_version}</p>

            <label className="block text-sm font-medium text-black">Accepted Terms Version:</label>
            <p className="mb-4">{customer.accepted_terms_version}</p>
            </div>
        );
        case 'companies':
        return (

            <CompaniesTable customerId={customerId} /> 
 
        );
        case 'games':
        return (

            <GamesTable customerId={customerId} />
        ); 
        default:
        return null;
    }
};

  return (
    <div className="p-5 rounded-lg shadow-lg w-full bg-white"> 

      <div className="flex justify-end mb-4">

        </div>
        <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
        <div className="mb-4">
          <button
            className={`mr-2 ${activeTab === 'details' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`mr-2 ${activeTab === 'companies' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={`${activeTab === 'games' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('games')}
          >
            Games
          </button>
        </div>
        <div>
          {renderTabContent()}
        </div>
    </div>
  );
};

export default CustomerDetailForm;
