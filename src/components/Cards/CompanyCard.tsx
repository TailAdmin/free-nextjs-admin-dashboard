'use client';

import React, { useEffect, useState } from 'react';
import { CompanyEntity } from "@/entities/company/_domain/types";
import { useCompanies } from '@/hooks/useCompaniesData';
import Loader from '../common/Loader';
import GamesTable from '../Tables/GamesTable';
import CustomersTable from '../Tables/CustomersTable';
import { Card, CardBody, CardFooter, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';

interface CompanyDetailFormProps {
  companyId: string;
}

const CompanyDetailForm: React.FC<CompanyDetailFormProps> = ({companyId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[currentPage, setCurrentPage] = useState(1);
    const[company, setCompany] = useState<CompanyEntity|null>(null);
    const pageSize = 1;
    let filter: any = {}; 
    filter = JSON.parse(`{"companyId":"${companyId}"}`);

    console.log(`Company card Filter: ${JSON.stringify(filter)}`)
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

    const handleTabChange = (key: any) => {
      setActiveTab(key); 
    };

    const renderTabContent = () => {
    switch (activeTab) {
        case 'details':
        return (
            <div> 
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">ID:</label>
                <p className="text-sm font-medium">{company.id}</p>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Name:</label>
                <p className="text-sm font-medium">{company.name}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">URL:</label>
                <a 
                  href={company.url} 
                  className="text-sm font-medium text-blue-500 hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer">
                    {company.url}
                </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Size:</label>
                <p className="text-sm font-medium">{company.size}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Domains:</label>
                <p className="text-sm font-medium">{company.domains}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Viewer_domains:</label>
                <p className="text-sm font-medium">{company.viewer_domains}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Created At:</label>
                <p className="text-sm font-medium">{company.created_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Modified At:</label>
                <p className="text-sm font-medium">{company.modified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Deleted_at:</label>
                <p className="text-sm font-medium">{company.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived_at:</label>
                <p className="text-sm font-medium">{company.archived_at}</p>
              </div>



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

    <Card className="w-full min-w-[600px]">
    <CardHeader className="flex gap-3"> 
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Company details</p>
        <div className="flex items-center">
          {company.logo_url && (
          <img 
            src={company.logo_url} 
            alt={`${company.name} logo`} 
            className="h-6 w-auto" 
          />
          )}
          <p className="text-lg text-default-500" >{company.name}</p>
        </div>
      </div>

    </CardHeader>
    <Divider/>

    <div className="flex w-full flex-col" >
          <Tabs aria-label="Options"
            onSelectionChange={handleTabChange}
          >
            <Tab key="details" title="Details">
              <Card>
                <CardBody>
                  {renderTabContent()}
                </CardBody>
              </Card>  
            </Tab>
            <Tab key="customers" title="Customers">
              <Card>
                <CardBody
                  
                >
                  {renderTabContent()}
                </CardBody>
              </Card>  
            </Tab>
            <Tab key="games" title="Games">
              <Card>
                <CardBody>
                  {renderTabContent()}
                </CardBody>
              </Card>  
            </Tab>
          </Tabs>
        </div> 


    {/* <Divider/>
    <CardFooter>

    </CardFooter> */}
  </Card>

  );
};

export default CompanyDetailForm;
