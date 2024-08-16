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

    <Card className="w-full min-w-[600px]">
    <CardHeader className="flex gap-3"> 
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Company details</p>
        <p className="text-md text-default-500">{company.name}</p>
      </div>

    </CardHeader>
    <Divider/>
    {/* <CardBody>
      <p>Make beautiful websites regardless of your design experience.</p>
    </CardBody> */}

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
