'use client';

import React, { useEffect, useState } from 'react';
import { GameEntity } from "@/entities/game/_domain/types";
import { useDataFetcher } from '@/hooks/useDataFetcher';
import Loader from '../Common/Loader';
import CustomersTable from '../Tables/CustomersTable';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface GameDetailFormProps {
  gameId: string;
}

const GameDetailForm: React.FC<GameDetailFormProps> = ({gameId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[game, setGame] = useState<GameEntity|null>(null);
    const filter: any = JSON.parse(`{"gameId":"${gameId}"}`);
    const [linkValue, setLinkValue] = useState('');
//getting game details
    const {data, isLoading, error, total, fetchData } = useDataFetcher<GameEntity>();
    //getting function for posting logs
    const { logMessage } = useLogger();
    useEffect(() => {

      fetchData({
        endpoint:API_ENDPOINTS.GAMES,
        selectedFilterValue:filter
      });
          
    },[]);

    useEffect(() => {
      if (data.length > 0) {
        setGame(data[0]);
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

    if (!game) {
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
                <p className="text-sm font-medium">{game.id}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Name:</label>
                  <a 
                    href={game.game_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={()=>{handleLinkClick(game.game_link)}}>
                      {game.name}
                  </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">URL:</label>
                  <a 
                    href={game.url} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer">
                      {game.url}
                  </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Description:</label>
                <p className="text-sm font-medium">{game.description}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Company:</label>
                  <a 
                    href={game.company_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer">
                      {game.company_name}
                  </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Social Medias:</label>
                <p className="text-sm font-medium">{game.social_medias ? JSON.stringify(game.social_medias) : ""}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Game Stores:</label>
                <p className="text-sm font-medium">{JSON.stringify(game.game_stores)}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Login Type:</label>
                <p className="text-sm font-medium">{game.login_type}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Locale Default:</label>
                <p className="text-sm font-medium">{game.locale_default}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Login Settings:</label>
                <p className="text-sm font-medium">{game.login_settings ? JSON.stringify(game.login_settings): ""}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Created At:</label>
                <p className="text-sm font-medium">{game.created_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Modified At:</label>
                <p className="text-sm font-medium">{game.modified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Deleted At:</label>
                <p className="text-sm font-medium">{game.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived At:</label>
                <p className="text-sm font-medium">{game.archived_at}</p>
              </div>



            </div>  
        );
        case 'customers':
        return (

            <CustomersTable companyId={game.company_id} /> 
 
        );
        default:
        return null;
    }
};

  return (

    <Card className="w-full min-w-[600px]">
      <CardHeader className="flex gap-3"> 
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Game Details</p>
          <div className="flex items-center" >
            {game.logo_url && (
            <img 
              src={game.logo_url} 
              alt={`${game.name} logo`} 
              className="h-6 w-auto" 
            />
            )}
            <p className="text-lg text-default-500 ml-2" >{game.name}</p>
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
      </Tabs>
    </Card>

  );
};

export default GameDetailForm;
