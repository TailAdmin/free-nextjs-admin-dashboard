'use client';

import React, { useState } from 'react';
import { SearchIcon } from '../Icons/Table/search-icon';
import {parseDate} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

import {LinkType, ColumnType} from "@/types/tableTypes"
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/table"

import { Button, DateRangePicker, DateValue, Input, Pagination, RangeValue, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '../common/Loader';

type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
interface BaseTableProps<T> {
    data: T[];
    columns: ColumnType<T>[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    isLoading?: boolean;
    error?: string | null;
    filterValue: string;
    routeName?: string;
    isDateRange?: boolean;
    dateRangeValue?: string[]|null;
    onSetDateRangeValue?: (dateRangeValue: string[]|null) => void;
    onSetPageNumber(pageNumber: number): void;
    onSetPageSize(pageSize: number): void;
    onFilterChange: (filterValue: string) => void;
    onFilterSubmit: () => void;
 
}



const BaseTableNextUI = <T extends Record<string, any>>({
    data,
    columns,
    currentPage,
    pageSize,
    totalPages,
    filterValue,
    isLoading,
    error,
    routeName = "none",
    isDateRange = false,
    dateRangeValue,
    onSetDateRangeValue,
    onSetPageNumber,
    onSetPageSize,
    onFilterChange,
    onFilterSubmit,

}: BaseTableProps<T>) => {
    const selectedColor: ColorType = "primary"
    const router = useRouter()

// rounting by double click to interbal pages (cards)
    const handlePageSizeChange = (value:string) => {
        onSetPageSize(parseInt(value, 10));
    };
    const handleOpenForm = (route: string, id: string) => {
        if (route !== "none"){
            router.push(`${route}${id}`); 
        }    
    };
// changing date range filter in the parent component
    const handleDateRangeChange = (value: RangeValue<DateValue>) => {
        if (isDateRange && onSetDateRangeValue) {
            onSetDateRangeValue([value.start.toString(), value.end.toString()]);
        }
    }
// string list turning into RangeValue<DateValue>
    const getRangeValue = (value: string[]|null|undefined): RangeValue<DateValue> | null=>{
        if (!value) return null;
        const startDate: DateValue = parseDate(value[0]);
        const endDate: DateValue = parseDate(value[1]);
        const dateRange: RangeValue<DateValue> = { start: startDate, end: endDate };
        return dateRange;
    }
// clear filter values in the parent component
    const handleClear=() => {
        onFilterChange('');
        if(isDateRange && onSetDateRangeValue) {
            onSetDateRangeValue(null);
        }
    }

// rendering table cell content
    const TableCellContent = (
        {
            column,
            row,
        }: 
        {
            column: ColumnType<T>;
            row: T;
        }) =>
    {
//rendering cell with external links
        if (column.link_type === "external" && column.link && typeof column.link === 'string') {
            return (
                <a className='text-blue-500 hover:underline'
                    href={row[column.link]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                >
                    {row[column.key]}
                </a>
            );
//rendering cell with internal links
        } else if (column.link_type === "internal" && column.link) {
            return (
                <Link
                    className='text-blue-500 hover:underline'
                    href={typeof column.link === 'function' ? column.link(row) : column.link}
                    onClick={(e) => e.stopPropagation()}
                >
                    {row[column.key]}
                </Link>
            );
        }
        return <span>{row[column.key]}</span>;
    }

// rendering top part of table: search text, date range, page size selector
    const topContent = React.useMemo(() => {
        return (
            <>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-left gap-3 items-center m-4"> 
                            <Input
                                isClearable
                                className="w-full sm:max-w-[90%]"
                                placeholder="Search by text..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onValueChange={onFilterChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onFilterSubmit();
                                    }
                                }}
                            />
                            {isDateRange && (
                                <div>
                                    <DateRangePicker 
                        
                                        labelPlacement={"outside"}
                                        className="max-w-xs ml-2" 
                                        value={getRangeValue(dateRangeValue)}
                                        onChange={handleDateRangeChange}
                                    />
                                </div>
                            )}
                            <Button
                                className={`bg-${"default"}-500 text-white`} 
                                size="md"
                                onClick={onFilterSubmit}
                            >   
                                Apply
                            </Button>
                            <Button 
                                onClick={handleClear} 
                                className={`bg-${"default"}-500 text-white`}
                            >
                                Clean
                            </Button>
                        </div>
                        <Select
                            
                            defaultSelectedKeys={[String(pageSize)]}
                            onSelectionChange={(keys) => 

                                    {
                                        const selectedValue = Array.from(keys).join(""); 
                                        handlePageSizeChange(selectedValue);
                                    }

                            }
                            className="w-auto min-w-[80px] m-4"
                        >
                            <SelectItem key="10">10</SelectItem>
                            <SelectItem key="20">20</SelectItem>
                            <SelectItem key="50">50</SelectItem>
                            <SelectItem key="100">100</SelectItem>
                        </Select>
                    </div>
                </div>

                <div>
                    {totalPages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={currentPage}
                                total={totalPages}
                                onChange={(page) => onSetPageNumber(page)}
                            />
                        </div>
                        ) : null}
                </div>

            </>
        )
    }, [filterValue, dateRangeValue, pageSize, totalPages, currentPage]);     

    if (isLoading) {
        return <Loader />;
    } 
    
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            <Table 
                color={selectedColor}
                selectionMode="single" 
                defaultSelectedKeys={["2"]} 
                isStriped 
                topContent={topContent}
                topContentPlacement='outside'
                aria-label='qwe'
                >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={String(column.key)}>{column.label}</TableColumn>}

                </TableHeader>

                    <TableBody>

                        {data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}
                            
                                onDoubleClick={() => {
                                    if (routeName !== "none") {
                                        handleOpenForm(routeName, row.id); 
                                    } 
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)}>

                                        <div 
                                            className="truncate max-w-xs" 
                                            title={row[column.key] as unknown as string} 
                                        >
                                            <TableCellContent column = {column} row = {row} />    
                                            
                                        </div>
                                        
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>

            </Table>

        </div>
    );

    
};

export default BaseTableNextUI;
