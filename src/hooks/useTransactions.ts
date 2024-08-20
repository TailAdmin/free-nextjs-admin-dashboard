
import { useState } from 'react';
import { Transaction } from '@/entities/transaction/_domain/types';

export const useTransactions = (page: number, pageSize: number) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchTransactions = async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {
            let filterFields : any = {};
            filterFields = {...selectedFilterValue};
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
    };



    return { transactions, isLoading, error, total, fetchTransactions};
};