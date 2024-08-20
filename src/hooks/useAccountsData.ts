import { useState } from "react";
import { AccountEntity } from '@/entities/account/_domain/types';

export const useAccounts = (page: number, pageSize: number, filter?: Record<string, any>) => {
    const [accounts, setAccounts] = useState<AccountEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);


    const fetchAccounts = async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {
                let filterFields : any = {};
                filterFields = {...filter, ...selectedFilterValue};
                const response = await fetch(`/api/account?page=${page}&pageSize=${pageSize}&filter=${JSON.stringify(filterFields)}`);
                const { data, total } = await response.json();
                setAccounts(data);
                setTotal(total);

            } catch (err) {
                setError(`Failed to load accounts ${err}`);
            } finally {
                setIsLoading(false);
            }
    };

    return { accounts, isLoading, error, total, fetchAccounts };
};
