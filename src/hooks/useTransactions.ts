
import { useCallback, useState } from 'react';
import { TransactionEntity } from '@/entities/transaction/_domain/types';
import { DataFetchParams } from '@/types/dataHooksTypes';

export const useTransactions = ({page = 1, pageSize = 10, filter = {}}: DataFetchParams) => {
    const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchTransactions = useCallback(async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {

            const filterFields = {...selectedFilterValue};
            const response = await fetch(`/api/transaction?page=${page}&pageSize=${pageSize}&filter=${JSON.stringify(filterFields)}`);
            const { data, total } = await response.json();

            setTotal(total);
            setTransactions(data);
        } catch (err) {
            const error = err as Error;
            console.error('Error loading transactions', error);
            setError(`Failed to load transactions: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, filter]);



    return { transactions, isLoading, error, total, fetchTransactions};
};