import React, { createContext, useContext, useState } from 'react';

interface FilterContextProps {
filterValue: string;
dateRangeValue: string[] | null;
complexFilterValue: Record<string, any> | undefined;
showFilters: boolean;
currentPage?: number;
handleCurrentPageChange?:(pageValue:number)=>void;
handleDateRangeChange?: (dateRangeValue: string[]|null) => void;
handleFilterChange?: (filterValue: string) => void;
handleFilterSubmit?: () => void;
handleClear?: () => void;
handleContextInit?: () => void;
setShowFilters?: (showFilterValue: boolean) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [filterValue, setFilterValue] = useState('');
const [dateRangeValue, setDateRangeValue] = useState<string[] | null>(null);
const [complexFilterValue, setComplexFilterValue] = useState<Record<string, any>>({});
const [showFilters, setShowFilters] = useState(false);
const [currentPage, setCurrentPage] = useState(1);

const handleFilterChange = (filterValue: string) => {
    setFilterValue(filterValue);
};

const handleFilterSubmit = () => {
    //setCurrentPage(1); 

    const filterFields = {
    selectedFields: filterValue || "", 
    dateRange: dateRangeValue ? dateRangeValue : ["", ""] 
    };
    setComplexFilterValue(filterFields);
    setCurrentPage(1);


}
    
const handleCurrentPageChange = (pageValue: number) =>{
    setCurrentPage(pageValue);
}

const handleDateRangeChange = (dateRangeValue: string[]|null) => {
setDateRangeValue(dateRangeValue)
};

const handleClear=() => {
    handleFilterChange('');
    if(handleDateRangeChange) {
        handleDateRangeChange(null);
    }
}

const handleContextInit=() => {
    handleFilterChange('');
    if(handleDateRangeChange) {
        handleDateRangeChange(null);
    }
    setComplexFilterValue({});
    setCurrentPage(1);
}

return (
    <FilterContext.Provider
    value={{ filterValue, 
            dateRangeValue, 
            complexFilterValue, 
            showFilters, 
            currentPage, 
            handleCurrentPageChange,
            setShowFilters,
            handleDateRangeChange, 
            handleFilterChange, 
            handleFilterSubmit, 
            handleClear,
            handleContextInit,}}
    >
    {children}
    </FilterContext.Provider>
);
};

export const useFilter = () => {
const context = useContext(FilterContext);
if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
}
return context;
};