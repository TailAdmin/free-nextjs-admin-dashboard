import { useState, useEffect } from "react";
import { CustomerEntity } from '@/entities/customer/_domain/types';

export const useCustomers = (page: number, pageSize: number) => {
    const [customers, setCustomers] = useState<CustomerEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/customer?page=${page}&pageSize=${pageSize}`);
                console.log(response);
                const { data, total } = await response.json();
                setCustomers(data);
                setTotal(total);
            } catch (err) {
                setError(`Failed to load customers ${err}`);
            } finally {
                setIsLoading(false);
            }
    }   ;

    fetchCustomers();
    }, [page, pageSize]);

    return { customers, isLoading, error, total };
};
