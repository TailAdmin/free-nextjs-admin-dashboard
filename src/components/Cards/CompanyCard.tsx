'use client';

import React, { useEffect, useState } from 'react';
import { CompanyEntity } from "@/entities/company/_domain/types";
import { useDataFetcher } from '@/hooks/useDataFetcher';
import Loader from '../Common/Loader';
import GamesTable from '../Tables/GamesTable';
import CustomersTable from '../Tables/CustomersTable';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface CompanyDetailFormProps {
  companyId: string;
}

const CompanyDetailForm: React.FC<CompanyDetailFormProps> = ({companyId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[company, setCompany] = useState<CompanyEntity|null>(null);
    const filter = JSON.parse(`{"companyId":"${companyId}"}`);
    const [linkValue, setLinkValue] = useState('');
//getting company details
    const {data, isLoading, error, total, fetchData } = useDataFetcher<CompanyEntity>();
    //getting function for posting logs
    const { logMessage } = useLogger();
    useEffect(() => {

      fetchData({
        endpoint:API_ENDPOINTS.COMPANIES,
        selectedFilterValue:filter
      });
          
    },[]);

    useEffect(() => {
      if (data.length > 0) {
        setCompany(data[0]);
      }
    }, [data]);

    useEffect(() =>{
      if (linkValue){
          logMessage(`Link fetched: ${linkValue}`)
      }    
    },[linkValue]);
    const handleLinkClick = (linkValue: string) => {
      setLinkValue(linkValue);

    };

    if (error) {
      return <div>Error loading {error}</div>; 
    }

    if (!company) {
    return null;
    }
    if (isLoading) {
      return <Loader /> ;
    } 

    const handleTabChange = (key: any) => {
      setActiveTab(key); 
    };
    // tabs rendering
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
                  <a 
                    href={company.company_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={()=>{handleLinkClick(company.company_link)}}>
                      {company.name}
                  </a>
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
                <label className="block text-md font-medium mr-4">Domains Viewer:</label>
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
                <label className="block text-md font-medium mr-4">Deleted At:</label>
                <p className="text-sm font-medium">{company.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived At:</label>
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
          <p className="text-lg font-semibold">Company Details</p>
          <div className="flex items-center">
            {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`} 
              className="h-6 w-auto" 
            />
            )}
            <p className="text-lg text-default-500 ml-2" >{company.name}</p>
          </div>
        </div>

      </CardHeader>
      <Divider/>
      <Tabs aria-label="Options"
        onSelectionChange={handleTabChange}
        className='mt-2'
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
            <CardBody>
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
    </Card>

  );
};

export default CompanyDetailForm;
