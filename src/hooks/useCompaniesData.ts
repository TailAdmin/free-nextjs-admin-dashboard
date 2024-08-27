import { useCallback, useState } from "react";
import { CompanyEntity } from '@/entities/company/_domain/types';
import { DataFetchParams } from "@/types/dataHooksTypes";

export const useCompanies = ({page = 1, pageSize = 10, filter = {}}: DataFetchParams) => {
    const [companies, setCompanies] = useState<CompanyEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);


    const fetchCompanies = useCallback(async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {
                const filterFields = {...filter, ...selectedFilterValue};
                const response = await fetch(`/api/company?page=${page}&pageSize=${pageSize}&filter=${JSON.stringify(filterFields)}`);
                const { data, total } = await response.json();
                setCompanies(data);
                setTotal(total);

            } catch (err) {
                setError(`Failed to load companies ${err}`);
            } finally {
                setIsLoading(false);
            }
    },[page, pageSize, filter]);

    return { companies, isLoading, error, total, fetchCompanies };
};
