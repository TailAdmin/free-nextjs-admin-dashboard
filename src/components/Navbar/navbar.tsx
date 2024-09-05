    import { Button, DateRangePicker, DateValue, Input, Link, Navbar, NavbarContent, RangeValue } from "@nextui-org/react";
    import React, { useEffect, useState } from "react";
    import { BurguerButton } from "./burguer-button";
    import { UserDropdown } from "./user-dropdown";
    import { DarkModeSwitch } from "./darkModeSwitch";
    import useUserData from "@/hooks/useUserData";
    import { useFilter } from "./filter-context";
    import {parseDate} from "@internationalized/date";
    import { SearchIcon } from "../Icons/Table/search-icon";


    interface Props {
    children: React.ReactNode;

    }

    export const NavbarWrapper = ({ children }: Props) => {
        const { userData, isLoading, error } = useUserData();
        const { filterValue, dateRangeValue, showFilters, handleFilterChange, handleFilterSubmit, handleDateRangeChange, handleClear } = useFilter();
        


    // Преобразование строкового диапазона в объект диапазона дат
    const getRangeValue = (value: string[] | null | undefined): RangeValue<DateValue> | null => {
        if (!value) return null;
        const startDate: DateValue = parseDate(value[0]);
        const endDate: DateValue = parseDate(value[1]);
        const dateRange: RangeValue<DateValue> = { start: startDate, end: endDate };
        return dateRange;
    };
        return (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered

                className="w-full"
                classNames={{
                wrapper: "w-full max-w-full",
                }}
            >
                <NavbarContent className="md:hidden">
                    <BurguerButton />
                </NavbarContent>

                <NavbarContent
                    justify="start"
                    className="w-fit data-[justify=right]:flex-grow-0"
                >

                    {showFilters && (
                        <div className="flex justify-start gap-2 items-center">
                            <Input
                                isClearable = {true}
                                startContent={<SearchIcon />}
                                placeholder="Search by text..."
                                value={filterValue}
                                onValueChange={handleFilterChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleFilterSubmit ? handleFilterSubmit() : null; 
                                    }
                                }}
                                className="w-full sm:max-w-[100%]"
                            />
                            <DateRangePicker
                                labelPlacement="outside"
                                value={getRangeValue(dateRangeValue)}
                                onChange={(range) => handleDateRangeChange ? handleDateRangeChange([range.start.toString(), range.end.toString()]): null}
                                className="max-w-xs ml-2" 
                            />
                            <Button 
                                className={`bg-${"default"}-500 text-white ml-2`} 
                                size="md"
                                onClick={handleFilterSubmit}>
                                Apply
                            </Button>
                            <Button 
                                onClick={handleClear} 
                                size="md"
                                className={`bg-${"default"}-500 text-white ml-2`}
                            >
                                Clean
                            </Button>
                        </div>
                        )
                    }


                    <NavbarContent justify="end">
                        
                        <DarkModeSwitch />
                            <p>{userData?.fullname}</p>
                        <UserDropdown />
                    </NavbarContent>
                </NavbarContent>
            </Navbar>
                {children}
        </div>
    );
    };