'use client';

import React, { useState, ReactNode } from 'react';
import { SearchIcon } from '../Icons/Table/search-icon';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue
} from "@nextui-org/table"

import { Button, Input, Pagination, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

interface BaseTableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    filterValue: string;
    routeName?: string;
    onSetPageNumber(pageNumber: number): void;
    onSetPageSize(pageSize: number): void;
    onFilterChange: (filterValue: string) => void;
    onFilterSubmit: () => void;
 
}
const colors: ColorType[] = ["default", "primary", "secondary", "success", "warning", "danger"];



const BaseTableNextUI = <T extends Record<string, any>>({
    data,
    columns,
    currentPage,
    totalPages,
    filterValue,
    isLoading,
    error,
    routeName = "none",
    onSetPageNumber,
    onSetPageSize,
    onFilterChange,
    onFilterSubmit,


}: BaseTableProps<T>) => {
    const [selectedColor, setSelectedColor] = React.useState<ColorType>("primary");
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter()

    const handlePageSizeChange = (value:string) => {
        setPageSize(parseInt(value, 10));
        onSetPageSize(parseInt(value, 10));
    };
    const handleOpenForm = (arr: any) => {
        if (routeName !== "none"){
            router.push(`${routeName}${arr['id']}`); 
        }    
    };

    const topContent = React.useMemo(() => {
        return (
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
                <Button
                    className={`bg-${"default"}-500 text-white`} 
                    size="md"
                    onClick={onFilterSubmit}
                    >   
                    Apply
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
        )
    }, [filterValue]);   

    const bottomContent = React.useMemo(() => {
        return (

            totalPages > 0 ? (
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
                ) : null

        )

    },[currentPage, totalPages, filterValue]);    

    return (
        <div className="flex flex-col gap-3">
            <Table 
                color={selectedColor}
                selectionMode="single" 
                defaultSelectedKeys={["2"]} 
                isStriped 
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                topContent={topContent}
                topContentPlacement='outside'
                aria-label='qwe'
                >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={String(column.key)}>{column.label}</TableColumn>}
                </TableHeader>
                {/* <TableBody items={data}>
                    
                    {(item) => (
                    <TableRow 
                        key={item.id}

                        
                        onDoubleClick={() => handleOpenForm(item)}

                    >
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody> */}

                    <TableBody>

                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}
                        
                        onDoubleClick={() => {
                            if (routeName !== "none") {
                                handleOpenForm(row); 
                            }
                        }}
                        >
                        {columns.map((column) => (
                            <TableCell key={String(column.key)}>

<div 
                                className="truncate max-w-xs" 
                                title={row[column.key] as unknown as string} 
                            >
                                {row[column.key] as unknown as ReactNode}
                            </div>

                                {/* {row[column.key] as unknown as ReactNode} */}
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
