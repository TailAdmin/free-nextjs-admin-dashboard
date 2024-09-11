'use client'

import { Select, SelectItem } from "@nextui-org/react";
import { CounterCard } from "../Counter/CounterCard"
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { CustomerEntity } from "@/entities/customer/_domain/types";
import Loader from "../Common/Loader";
import { CompanyEntity } from "@/entities/company/_domain/types";
import { GameEntity } from "@/entities/game/_domain/types";
import { UserEntity } from "@/entities/user/_domain/types";

const Dashboard = () =>{

const [days, setDays] = useState('7');
const [customersCount, setCustomersCount] = useState(0);
const [companiesCount, setCompaniesCount] = useState(0);
const [gamesCount, setGamesCount] = useState(0);
const [playersCount, setPlayersCount] = useState(0);
const [customersOnlineCount, setCustomersOnlineCount] = useState(0);
const [playersOnlineCount, setPlayersOnlineCount] = useState(0);

const getDateRange=(daysValue: string): string[] => {

    const endDate = new Date(); // current date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (parseInt(daysValue) - 1)); 
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    return [formattedStartDate, formattedEndDate]
}


    const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(getDateRange(days));
    const [dateRangeOnlineValue] = useState<string[] | null>(getDateRange('1'));
    const {isLoading: isLoadingCustomers, error: errorCustomers, total: totalCustomers, fetchData: fetchCustomers } = useDataFetcher<CustomerEntity>(); 
    const {isLoading: isLoadingCompanies, error: errorCompanies, total: totalCompanies, fetchData: fetchCompanies } = useDataFetcher<CompanyEntity>(); 
    const {isLoading: isLoadingGames, error: errorGames, total: totalGames, fetchData: fetchGames } = useDataFetcher<GameEntity>(); 
    const {isLoading: isLoadingPlayers, error: errorPlayers, total: totalPlayers, fetchData: fetchPlayers } = useDataFetcher<UserEntity>(); 

    const {isLoading: isLoadingCustomersOnline, error: errorCustomersOnline, total: totalCustomersOnline, fetchData: fetchCustomersOnline } = useDataFetcher<CustomerEntity>(); 
    const {isLoading: isLoadingPlayersOnline, error: errorPlayersOnline, total: totalPlayersOnline, fetchData: fetchPlayersOnline } = useDataFetcher<UserEntity>(); 


useEffect(() => {

    fetchCustomers({endpoint:API_ENDPOINTS.CUSTOMERS, selectedFilterValue: {dateRange:dateRangeValue}});
    fetchCompanies({endpoint:API_ENDPOINTS.COMPANIES, selectedFilterValue: {dateRange:dateRangeValue}});
    fetchGames({endpoint:API_ENDPOINTS.GAMES, selectedFilterValue: {dateRange:dateRangeValue}});
    fetchPlayers({endpoint:API_ENDPOINTS.PLAYERS, selectedFilterValue: {dateRange:dateRangeValue}});

},[days]);

useEffect(() => {
    fetchCustomersOnline({endpoint:API_ENDPOINTS.CUSTOMERS, selectedFilterValue: {last_login_at:dateRangeOnlineValue}});
    fetchPlayersOnline({endpoint:API_ENDPOINTS.PLAYERS, selectedFilterValue: {last_login_at:dateRangeOnlineValue}});


},[]);

useEffect(()=>{
    setCustomersOnlineCount(totalCustomersOnline);
    setPlayersOnlineCount(totalPlayersOnline);

},[totalCustomersOnline,totalPlayersOnline])

useEffect(() => {
    setCustomersCount(totalCustomers);
    setCompaniesCount(totalCompanies);
    setGamesCount(totalGames);
    setPlayersCount(totalPlayers);

},[totalCustomers, totalCompanies, totalGames, totalPlayers]);


const handleDaysChange = (daysValue: string) => {

    setDays(daysValue);
    setDateRangeValue(getDateRange(daysValue));
}



if (isLoadingCustomers||isLoadingCompanies||isLoadingGames||isLoadingPlayers) {
    return <Loader />;
} 

if (errorCustomers||errorCompanies||errorGames||errorPlayers) {
    
    return (
        <div className="flex items-center justify-center min-h-screen">

            <div className="text-red-500">Error updating counters</div>
        </div>
    );
}

return(
    <div className="flex flex-col">
        <div className="flex justify-end mt-4 mr-8">
        <Select
            size='md'
            variant = "faded"
            defaultSelectedKeys={[String(days)]}
            onSelectionChange={(keys) => 

                    {
                        const selectedValue = Array.from(keys).join(""); 
                        handleDaysChange(selectedValue);
                    }

            }
            className="w-auto min-w-[110px] max-w-[110px] text-xl"
        >
            <SelectItem key="1">1 day</SelectItem>
            <SelectItem key="7">7 days</SelectItem>
            <SelectItem key="14">14 days</SelectItem>
            <SelectItem key="30">30 days</SelectItem>
            <SelectItem key="10000">All days</SelectItem>
        </Select>
        </div>

        <div className="flex justify-between gap-5 mt-8 ml-5">
            <CounterCard title="Companies" value={String(companiesCount)} hint={`Companies created from ${dateRangeValue ? dateRangeValue[0]:""}`}  />
            <CounterCard title="Customers" value={String(customersCount)} hint={`Customers created from ${dateRangeValue ? dateRangeValue[0]:""}`}   />

            <CounterCard title="Games" value={String(gamesCount)} hint={`Games created from ${dateRangeValue ? dateRangeValue[0]:""}`}   />

            <CounterCard title="Players" value={String(playersCount)} hint={`Players created from ${dateRangeValue ? dateRangeValue[0]:""}`}  />

        </div>
        <div className="flex justify-center gap-5 mt-8 ml-5">
            <CounterCard title="Customers online" value={String(customersOnlineCount)} hint={`Customers with login date today`} />
            <CounterCard title="Players online" value={String(playersOnlineCount)} hint={`Players with login date today`}  />
        </div>    
    </div>    
)
}

export default Dashboard;