import React, { useEffect, useState } from 'react';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import { CompanyEntity } from "@/entities/company/_domain/types";
import { GameEntity } from "@/entities/game/_domain/types";
import Link from 'next/link';
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import { useGames } from '@/hooks/useGamesData';

interface CustomerDetailFormProps {
  customer: CustomerEntity | null;
  onClose: () => void;
}

const CustomerDetailForm: React.FC<CustomerDetailFormProps> = ({ customer, onClose }) => {
    const [activeTab, setActiveTab] = useState('details');
    const[currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const {companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies } = useCompanies(currentPage, pageSize, customer?.id);
    const {games, isLoadingGames, errorGames, totalGames, fetchGames } = useGames(currentPage, pageSize, customer?.id);
    console.log(activeTab);
    useEffect(() => {
        if (activeTab === 'companies'){
          fetchCompanies();
        }else if(activeTab === 'games'){
          fetchGames();
        }

    }, [activeTab]);



    if (errorCompanies || errorGames) {
      return <div>Error loading {errorCompanies} {errorGames}</div>; 
    }

    if (!customer) {
    return null;
    }
    // if (isLoading) {
    //   return <Loader /> ;
    // }
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
            <ul>
                {companies.map((company) => (
                <li key={company.id} className="mb-2">{company.name}</li>
                ))}
            </ul>
        );
        case 'games':
        return (
            <ul>
                {games.map((game) => (
                    <li key={game.id} className="mb-2">{game.id} - {game.name} - {game.company_id}</li>
                ))}
            </ul>
        ); 
        default:
        return null;
    }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 mt-48">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full mt-16"> 
      <div className="flex justify-end mb-4">
        <button onClick={onClose} 
        className= "mb-4 text-red-500"
        >Close</button> 
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
    </div>
  );
};

export default CustomerDetailForm;
