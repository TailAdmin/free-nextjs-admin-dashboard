import { useCallback, useState } from "react";
import { GameEntity } from '@/entities/game/_domain/types';
import { DataFetchParams } from '@/types/dataHooksTypes';


export const useGames = ({page=1, pageSize=10, filter = {}}: DataFetchParams ) => {
    const [games, setGames] = useState<GameEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);


    const fetchGames = useCallback(async (selectedFilterValue: Record<string, any>={}) => {
        setIsLoading(true);
        setError(null);
        try {
                const filterFields = {...filter, ...selectedFilterValue};
                const response = await fetch(`/api/game?page=${page}&pageSize=${pageSize}&filter=${encodeURIComponent(JSON.stringify(filterFields))}`);
                const { success, data, total } = await response.json();
                if (!success) {
                    throw new Error('Failed to load games');
                }
                setGames(data);
                setTotal(total);
            } catch (err) {
                setError(`${err}`);
            } finally {
                setIsLoading(false);
            }
    },[page, pageSize, filter]);

    return { games, isLoading, error, total, fetchGames };
};
