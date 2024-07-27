import { useState } from "react";
import { CompanyEntity } from '@/entities/company/_domain/types';

export const useCompanies = (page: number, pageSize: number, filter?: string | null) => {
    const [companies, setCompanies] = useState<CompanyEntity[]>([]);
    const [isLoadingCompanies, setIsLoading] = useState(true);
    const [errorCompanies, setError] = useState<string | null>(null);
    const [totalCompanies, setTotal] = useState(0);


    const fetchCompanies = async () => {
        setIsLoading(true);
        setError(null);
        try {
                const response = await fetch(`/api/company?page=${page}&pageSize=${pageSize}&filter=${filter}`);
                const { data, total } = await response.json();
                setCompanies(data);
                setTotal(total);
            } catch (err) {
                setError(`Failed to load companies ${err}`);
            } finally {
                setIsLoading(false);
            }
    };

    return { companies, isLoadingCompanies, errorCompanies, totalCompanies, fetchCompanies };
};
