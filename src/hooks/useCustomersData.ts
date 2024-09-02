import { useCallback, useState } from "react";
import { CustomerEntity } from '@/entities/customer/_domain/types';
import { DataFetchParams } from "@/types/dataHooksTypes";


export const useCustomers = ({page = 1, pageSize = 10, filter={}}: DataFetchParams) => {
    const [customers, setCustomers] = useState<CustomerEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);


    const fetchCustomers = useCallback(async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {
            const filterFields = {...filter, ...selectedFilterValue};
            const response = await fetch(`/api/customer?page=${page}&pageSize=${pageSize}&filter=${encodeURIComponent(JSON.stringify(filterFields))}`);
            const { success, data, total } = await response.json();
            if (!success) {
                throw new Error('Failed to load customers');
            }
            setCustomers(data);
            setTotal(total);
        } catch (err) {
                setError(`${err}`);
        } finally {
            setIsLoading(false);
        }
}, [page, pageSize,filter]);


    return { customers, isLoading, error, total, fetchCustomers };
};
