'use client';

import React, { useEffect, useState } from 'react';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import Loader from '../common/Loader';
import { useCustomers } from '@/hooks/useCustomersData';
import CompaniesTable from '../Tables/CompaniesTable';
import GamesTable from '../Tables/GamesTable';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';

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

    const handleTabChange = (key: any) => {
      setActiveTab(key); 
    };

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
    <Card className="w-full min-w-[600px]">
    <CardHeader className="flex gap-3"> 
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Customer details</p>
        <p className="text-md text-default-500">{customer.name}</p>
      </div>

    </CardHeader>
    <Divider/>
    {/* <CardBody>
      <p>Make beautiful websites regardless of your design experience.</p>
    </CardBody> */}

<div className="flex w-full flex-col">
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
        <Tab key="companies" title="Companies">
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

export default CustomerDetailForm;
