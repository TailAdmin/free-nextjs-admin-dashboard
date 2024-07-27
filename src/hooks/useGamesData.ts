import { useState } from "react";
import { GameEntity } from '@/entities/game/_domain/types';

export const useGames = (page: number, pageSize: number, filter?: string | null) => {
    const [games, setGames] = useState<GameEntity[]>([]);
    const [isLoadingGames, setIsLoading] = useState(true);
    const [errorGames, setError] = useState<string | null>(null);
    const [totalGames, setTotal] = useState(0);


    const fetchGames = async () => {
        setIsLoading(true);
        setError(null);
        try {
                const response = await fetch(`/api/game?page=${page}&pageSize=${pageSize}&filter=${filter}`);
                const { data, total } = await response.json();
                setGames(data);
                setTotal(total);
            } catch (err) {
                setError(`Failed to load games ${err}`);
            } finally {
                setIsLoading(false);
            }
    };

    return { games, isLoadingGames, errorGames, totalGames, fetchGames };
};
