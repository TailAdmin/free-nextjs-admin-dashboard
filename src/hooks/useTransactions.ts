
import { useState, useEffect } from 'react';
import { transactionsRepository } from '@/entities/transaction/_repositories/transaction';
import { Transaction } from '@/entities/transaction/_domain/types';

export const useTransactions = (page: number, pageSize: number): {transactions: Transaction[], isLoading: boolean, 
                                                                error: string|null, total: number, fetchTransactions: () => Promise<void>} => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/transaction?page=${page}&pageSize=${pageSize}`);
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