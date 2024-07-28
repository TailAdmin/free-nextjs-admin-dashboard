import { useState, useEffect } from "react";
import { CustomerEntity } from '@/entities/customer/_domain/types';
interface ApiResponse {
    data: CustomerEntity[];
    total: number;
 
  }
export const useCustomers = (page?: number, pageSize?: number, customerId?: string) => {
    const [customers, setCustomers] = useState<CustomerEntity[]>([]);
    const [isLoadingCustomers, setIsLoading] = useState(true);
    const [errorCustomers, setError] = useState<string | null>(null);
    const [totalCustomers, setTotal] = useState(0);


    const fetchCustomers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/customer?page=${page}&pageSize=${pageSize}&customerId=${customerId}`);
            const { data, total }: ApiResponse = await response.json();

            setCustomers(data);
            setTotal(total);
        } catch (err) {
                setError(`Failed to load customers ${err}`);
        } finally {
            setIsLoading(false);
        }
};


    return { customers, isLoadingCustomers, errorCustomers, totalCustomers, fetchCustomers };
};
