'use client';

import React, { useEffect, useState } from 'react';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import { CompanyEntity } from "@/entities/company/_domain/types";
import Link from 'next/link';
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import { useGames } from '@/hooks/useGamesData';
import { useCustomers } from '@/hooks/useCustomersData';
import CompaniesTable from '../Tables/CompaniesTable';
import GamesTable from '../Tables/GamesTable';
import CustomersTable from '../Tables/CustomersTable';

interface CompanyDetailFormProps {
  companyId: string;
}

const CompanyDetailForm: React.FC<CompanyDetailFormProps> = ({companyId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[currentPage, setCurrentPage] = useState(1);
    const[company, setCompany] = useState<CompanyEntity|null>(null);
    const pageSize = 1;
    let filter = JSON.parse(`{"companyId":"${companyId}"}`);
    const {companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies } = useCompanies(currentPage, pageSize, filter);
    
    useEffect(() => {


      fetchCompanies();

          
    },[]);

    useEffect(() => {
      console.log(`Companies: ${JSON.stringify(companies)}`);
      if (companies.length > 0) {
        setCompany(companies[0]);
      }
    }, [companies]);


    if (errorCompanies) {
      return <div>Error loading {errorCompanies}</div>; 
    }

    if (!company) {
    return null;
    }
    if (isLoadingCompanies) {
      return <Loader /> ;
    } 
    const renderTabContent = () => {
    switch (activeTab) {
        case 'details':
        return (
            <div> 
            <label className="block text-sm font-medium text-black">Name:</label>
            <p className="mb-4">{company.name}</p>

            <label className="block text-sm font-medium text-black">URL:</label>
            <p className="mb-4">{company.url}</p>

            <label className="block text-sm font-medium text-black">Size:</label>
            <p className="mb-4">{company.size}</p>

            <label className="block text-sm font-medium text-black">Created At:</label>
            <p className="mb-4">{company.created_at}</p>

            <label className="block text-sm font-medium text-black">Archived At:</label>
            <p className="mb-4">{company.archived_at}</p>
            </div>
        );
        case 'customers':
        return (

            <CustomersTable companyId={companyId} /> 
 
        );
        case 'games':
        return (

            <GamesTable companyId={companyId} />
        ); 
        default:
        return null;
    }
};

  return (
    <div className="p-5 rounded-lg shadow-lg w-full bg-white"> 

      <div className="flex justify-end mb-4">

        </div>
        <h3 className="text-xl font-semibold mb-4">Company Details</h3>
        <div className="mb-4">
          <button
            className={`mr-2 ${activeTab === 'details' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`mr-2 ${activeTab === 'companies' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
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

export default CompanyDetailForm;
