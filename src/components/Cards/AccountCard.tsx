'use client';

import React, { useEffect, useState } from 'react';
import { AccountEntity } from "@/entities/account/_domain/types";
import { useAccounts } from '@/hooks/useAccountsData';
import Loader from '../common/Loader';
import GamesTable from '../Tables/GamesTable';
import CustomersTable from '../Tables/CustomersTable';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useLogger } from '@/hooks/useLogger';

interface AccountDetailFormProps {
  accountId: string;
}

const AccountDetailForm: React.FC<AccountDetailFormProps> = ({accountId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[account, setAccount] = useState<AccountEntity|null>(null);
    const filter = JSON.parse(`{"accountId":"${accountId}"}`);
    const [linkValue, setLinkValue] = useState('');
    //getting accounts details
    const {accounts, isLoading, error, total, fetchAccounts } = useAccounts({filter});
    //getting function for posting logs
    const { logMessage } = useLogger();
    useEffect(() => {


      fetchAccounts();

          
    },[]);

    useEffect(() => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }, [accounts]);


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

    if (!account) {
    return null;
    }
    if (isLoading) {
      return <Loader /> ;
    } 

    const handleTabChange = (key: any) => {
      setActiveTab(key); 
    };

// function for rendering json with recursia
    const renderJson = (data: any, level: number = 0) => {
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return <div>Error parsing JSON</div>;
        }
      }
      return Object.keys(data).map((key) => {
        const value = data[key];

        if (value === null || value === undefined) {
          return null;
        }
  
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return (
            <div key={key} style={{ marginLeft: level * 20 }}>
              <strong>{key}:</strong>
              <div>{renderJson(value, level + 1)}</div>
            </div>
          );
        } else if (Array.isArray(value)) {
          return (
            <div key={key} style={{ marginLeft: level * 20 }}>
              <strong>{key}:</strong>
              {value.map((item, index) => (
                <div key={index} style={{ marginLeft: 20 }}>
                  {typeof item === 'object' ? renderJson(item, level + 1) : item.toString()}
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div key={key} style={{ marginLeft: level * 20 }}>
              <strong>{key}:</strong> {value !== null ? value.toString() : 'null'}
            </div>
          );
        }
      });
    }

    // tabs rendering
    const renderTabContent = () => {
    switch (activeTab) {
        case 'details':
        return (
            <div> 
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Account ID:</label>
                <p className="text-sm font-medium">{account.id}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Company:</label>
                  <a 
                    href={account.company_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => {
                      handleLinkClick(account.company_link)}}>
                      {account.company_name}
                  </a>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Details:</label>
              </div>
              <Divider className='mt-4 mb-2' />

                {renderJson(account.details)}
              <Divider className='mt-2 mb-4' />

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Details Version:</label>
                <p className="text-sm font-medium">{account.details_version}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Verify State:</label>
                <p className="text-sm font-medium">{account.verify_state}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Edited by Customer:</label>
                <Link
                    className='text-blue-500 hover:underline'
                    href={`/customer-card/${account.edited_by_customer_id}`}
                >
                    {account.edited_by_customer_name}
                </Link>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Verfied by Customer:</label>
                <Link
                    className='text-blue-500 hover:underline'
                    href={`/customer-card/${account.verified_by_customer_id}`}
                >
                    {account.verified_by_customer_name}
                </Link>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Verified At:</label>
                <p className="text-sm font-medium">{account.verified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Created At:</label>
                <p className="text-sm font-medium">{account.created_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Modified At:</label>
                <p className="text-sm font-medium">{account.modified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Deleted At:</label>
                <p className="text-sm font-medium">{account.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived At:</label>
                <p className="text-sm font-medium">{account.archived_at}</p>
              </div>



            </div>  
        );
        case 'customers':
        return (

            <CustomersTable companyId={account.company_id} /> 
 
        );
        case 'games':
        return (

            <GamesTable companyId={account.company_id} />
        ); 
        default:
        return null;
    }
};

  return (

    <Card className="w-full min-w-[600px]">
      <CardHeader className="flex gap-3"> 
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Account Details</p>
          <div className="flex items-center">
            <p className="text-lg text-default-500" >{account.id}</p>
          </div>
        </div>

      </CardHeader>
      <Divider />
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

export default AccountDetailForm;
