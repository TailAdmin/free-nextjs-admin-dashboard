'use client';

import React, { useEffect, useState } from 'react';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import Loader from '../Common/Loader';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import CompaniesTable from '../Tables/CompaniesTable';
import GamesTable from '../Tables/GamesTable';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface CustomerDetailFormProps {
  customerId?: string;
  companyId?: string;
}

const CustomerDetailForm: React.FC<CustomerDetailFormProps> = ({ customerId, companyId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[customer, setCustomer] = useState<CustomerEntity|null>(null);
    let filter: Record<string, any> = customerId ? JSON.parse(`{"customerId":"${customerId}"}`) :
                                      companyId ?  JSON.parse(`{"companyId":"${companyId}"}`) : {}

    //getting customer details
    const {data, isLoading, error, fetchData} = useDataFetcher<CustomerEntity>();
    
    useEffect(() => {

      fetchData({
        endpoint:API_ENDPOINTS.CUSTOMERS,
        selectedFilterValue:filter
      });

    },[]);

    useEffect(() => {
      if (data.length > 0) {
        setCustomer(data[0]);
      }
    }, [data]);


    if (error ) {
      return <div>Error loading {error}</div>; 
    }

    if (!customer) {
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
                  <p className="text-sm font-medium">{customer.id}</p>
              </div>
              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Name:</label>
                  <p className="text-sm font-medium">{customer.name}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">E-mail:</label>
                  <p className="text-sm font-medium">{customer.email}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Sub:</label>
                  <p className="text-sm font-medium">{customer.sub}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Is Staff:</label>
                  <p className="text-sm font-medium">{customer.is_staff}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Accepted Privacy Version:</label>
                  <p className="text-sm font-medium">{customer.accepted_privacy_version}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Accepted Privacy Version At:</label>
                  <p className="text-sm font-medium">{customer.accepted_privacy_at}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Accepted Term Version:</label>
                  <p className="text-sm font-medium">{customer.accepted_terms_version}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Accepted Term Version At:</label>
                  <p className="text-sm font-medium">{customer.accepted_terms_at}</p>
              </div>

              <div className="flex items-center mb-4">
                  <label className="block text-md font-medium mr-4">Created At:</label>
                  <p className="text-sm font-medium">{customer.created_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Modified At:</label>
                <p className="text-sm font-medium">{customer.modified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Deleted At:</label>
                <p className="text-sm font-medium">{customer.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived At:</label>
                <p className="text-sm font-medium">{customer.archived_at}</p>
              </div>



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
    <Card className="w-full min-w-[600px]">
      <CardHeader className="flex gap-3"> 
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Customer Details</p>
          <p className="text-md text-default-500">{customer.name}</p>
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
        <Tab key="companies" title="Companies">
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

export default CustomerDetailForm;
