'use client'

import { useEffect, useState } from "react";
import BaseTableNextUI from "./BaseTableNextUI";
import { ColumnType} from "@/types/tableTypes"
import { CustomerEntity } from "@/entities/customer/_domain/types";
import { useLogger } from "@/hooks/useLogger";
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useFilter } from "../Navbar/filter-context";

interface CustomersTableProps {
  companyId?: string;

}

const TableCustomer: React.FC<CustomersTableProps> = ({companyId }: CustomersTableProps)  => {
  const [linkValue, setLinkValue] = useState('');

  //const [currentPage, setCurrentPage] = useState(1);
  //const [isCurrentPageInited, setIsCurrentPageInited] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [filter, setFilter] = useState(companyId ? {companyId} : {})

  //const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>();
  const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
    

  const {complexFilterValue, setShowFilters, handleContextInit, currentPage} = useFilter();
  const [initialized, setInitialized] = useState(false);
// init currentPage
// useEffect(()=>{

//   if (handleCurrentPageChange) {
//       handleCurrentPageChange(1);  
//   }
// }, [handleCurrentPageChange])


// settings for global filter context
  useEffect(() => {

    if (setShowFilters)
        {setShowFilters(true);}
    if (handleContextInit) {
      handleContextInit();
  }

    return () => {
        if (setShowFilters)
        {setShowFilters(false);}
        if (handleContextInit) {
          handleContextInit();
        }
    };
    }, []);

  const { data: customers, isLoading, error, total, fetchData } = useDataFetcher<CustomerEntity>(); 




  const { logMessage } = useLogger();

  // useEffect(() => {
  //   setCurrentPage(1)
  //   setIsCurrentPageInited(true);
  // },[complexFilterValue])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!initialized) {
      timeoutId = setTimeout(() => setInitialized(true), 100);  
    }else{
      fetchData({
              endpoint: API_ENDPOINTS.CUSTOMERS, 
              page:currentPage,
              pageSize:pageSize,
              selectedFilterValue:{...complexFilterValue, ...filter}});
    }          

}, [initialized, currentPage, pageSize, complexFilterValue]);

useEffect(() => {

    setTotalPages(Math.ceil(total / pageSize));

},[total, pageSize]);

  useEffect(() =>{
    if (linkValue){
        logMessage(`Link fetched: ${linkValue}`)
    }    
  },[linkValue]);

  const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};

const handleFilterSubmit = () => {
    //setCurrentPage(1); 

    const filterFields = {
      selectedFields: filterValue || "", 
      created_at: dateRangeValue ? dateRangeValue : ["", ""] 
    };
    //setComplexFilterValue(filterFields);

    
};
const handleLinkClick = (linkValue: string) => {
  setLinkValue(linkValue);
};

const handleDateRangeChange = (dateRangeValue: string[]|null) => {
  setDateRangeValue(dateRangeValue)
};

  const columns: ColumnType<CustomerEntity>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-mail' },
    { key: 'is_staff', label: 'Is Staff' },
    { key: 'created_at', label: 'Created at' },
  ];


  return (
  <div>
        <BaseTableNextUI
            data={customers}
            columns={columns}
            //currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            isDateRange={true}
            filterValue={filterValue}
            routeName='/customer-card/'
            //onSetPageNumber={setCurrentPage}
            onSetPageSize={setPageSize}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}
            onLinkClick={handleLinkClick}
            dateRangeValue={dateRangeValue}
            onSetDateRangeValue={handleDateRangeChange}

        />
</div>
  );

};

export default TableCustomer;
