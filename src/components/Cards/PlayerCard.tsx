'use client';

import React, { useEffect, useState } from 'react';
import { UserEntity } from "@/entities/user/_domain/types";
import { useDataFetcher } from '@/hooks/useDataFetcher';
import Loader from '../common/Loader';
import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface PlayerDetailFormProps {
  userId: string;
}

interface PlayerAttributes {
  level: number;
  saved_ach: boolean;
  saved_card: boolean;
  appsflyer_id: string | null;
  appsflyer_meta: string | null;
  appsflyer_app_id: string | null;
  hard_currency_count: number;
  soft_currency_count: number;
}

const GameDetailForm: React.FC<PlayerDetailFormProps> = ({userId}) => {
    const [activeTab, setActiveTab] = useState('details');
    const[player, setPlayer] = useState<UserEntity|null>(null);
    const filter: any = JSON.parse(`{"userId":"${userId}"}`);
    const [linkValue, setLinkValue] = useState('');
//getting player details
    const {data, isLoading, error, total, fetchData } = useDataFetcher<UserEntity>({endpoint: API_ENDPOINTS.PLAYERS, filter});
    //getting function for posting logs
    const { logMessage } = useLogger();
    useEffect(() => {

      fetchData();
          
    },[]);

    useEffect(() => {
      if (data.length > 0) {
        setPlayer(data[0]);
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

    if (!player) {
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
                <label className="block text-md font-medium mr-4">User ID:</label>
                <p className="text-sm font-medium">{player.id}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Player ID:</label>
                <p className="text-sm font-medium">{player.player_id}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">User Name:</label>
                <p className="text-sm font-medium">{player.name}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Email:</label>
                <p className="text-sm font-medium">{player.email}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Country:</label>
                <p className="text-sm font-medium">{player.country}</p>
              </div>  



              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Game:</label>
                  <a 
                    href={player.game_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={()=>{handleLinkClick(player.game_link)}}>
                      {player.game_name}
                  </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Company:</label>
                  <a 
                    href={player.company_link} 
                    className="text-sm font-medium text-blue-500 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={()=>{handleLinkClick(player.company_link)}}>
                      {player.company_name}
                  </a>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Banned:</label>
                <p className="text-sm font-medium">{player.banned}</p>
              </div>   

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Last Login At:</label>
                <p className="text-sm font-medium">{player.last_login_at}</p>
              </div>            

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Last Verified At:</label>
                <p className="text-sm font-medium">{player.last_verified_at}</p>
              </div>   

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Created At:</label>
                <p className="text-sm font-medium">{player.created_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Modified At:</label>
                <p className="text-sm font-medium">{player.modified_at}</p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Deleted At:</label>
                <p className="text-sm font-medium">{player.deleted_at}</p>
              </div>


              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Archived At:</label>
                <p className="text-sm font-medium">{player.archived_at}</p>
              </div>



            </div>  
        );
        case 'attributes':
          return(
            <div> 
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Saved Bank Account:</label>
                <p className="text-sm font-medium">
                  {player.attributes && (player.attributes as unknown as PlayerAttributes).saved_ach
                    ? (player.attributes as unknown as PlayerAttributes).saved_ach
                    : "false"}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Saved Card:</label>
                <p className="text-sm font-medium">
                  {player.attributes && (player.attributes as unknown as PlayerAttributes).saved_card
                    ? (player.attributes as unknown as PlayerAttributes).saved_card
                    : "false"}
                </p>
              </div>

              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Soft Currency Count:</label>
                <p className="text-sm font-medium">
                  {player.attributes !== null && (player.attributes as unknown as PlayerAttributes).soft_currency_count !==null
                    ? (player.attributes as unknown as PlayerAttributes).soft_currency_count
                    : "false"}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Hard Currency Count:</label>
            
                <p className="text-sm font-medium">
                  {player.attributes !== null && (player.attributes as unknown as PlayerAttributes).hard_currency_count !== null
                    ? (player.attributes as unknown as PlayerAttributes).hard_currency_count
                    : "No data"}
                </p>

              
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Level:</label>
                <p className="text-sm font-medium">
                  {player.attributes !==null && (player.attributes as unknown as PlayerAttributes).level !==null
                    ? (player.attributes as unknown as PlayerAttributes).level
                    : "false"}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Appsflyer ID:</label>
                <p className="text-sm font-medium">
                  {player.attributes !==null && (player.attributes as unknown as PlayerAttributes).appsflyer_id !==null
                    ? (player.attributes as unknown as PlayerAttributes).appsflyer_id
                    : "false"}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-md font-medium mr-4">Appsflyer App ID:</label>
                <p className="text-sm font-medium">
                  {player.attributes !==null && (player.attributes as unknown as PlayerAttributes).appsflyer_app_id !==null
                    ? (player.attributes as unknown as PlayerAttributes).appsflyer_app_id
                    : "false"}
                </p>
              </div>

            </div>  

            

          );

        default:
        return null;
    }
};

  return (

    <Card className="w-full min-w-[600px]">
      <CardHeader className="flex gap-3"> 
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Player Details</p>
          <div className="flex items-center" >
            {player.logo_url && (
            <img 
              src={player.logo_url} 
              alt={`${player.name} logo`} 
              className="h-6 w-auto" 
            />
            )}
            <p className="text-lg text-default-500 ml-2" >{player.name}</p>
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
        <Tab key="attributes" title="Attributes">
          <Card>
            <CardBody>
              {renderTabContent()}
            </CardBody>
          </Card>  
        </Tab>
\
      </Tabs>
    </Card>

  );
};

export default GameDetailForm;
