import { dbClient } from "@/shared/lib/db";
import { GameEntity } from "../_domain/types";

export class GameRepository {



    mapToGameType = (data: any): GameEntity =>{
        const gameData = {

            id: data.id,
            name: data.name,
            company_id: data.company_id,
            description: data.description,
            url: data.url,
            logo_url: data.logo_url,
            login_type: data.login_type,
            social_medias: data.social_medias,
            game_stores: data.game_stores,
            login_settings: data.login_settings,
            locale_default: data.locale_default,
            created_at: data.created_at,
            modified_at: data.modified_at,
            deleted_at: data.deleted_at,
            archived_at: data.archived_at,

        }

        return gameData
    }
    async getGameById(gameId: string): Promise<GameEntity> {

        const rawData = dbClient.aghanim_game.findUniqueOrThrow({
            where: {
                id: gameId,
            },
        });
        
        return this.mapToGameType(rawData);;
    }
    async getGames(page: number, pageSize: number): Promise<{data: GameEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
                
        const[rawData, total] = await Promise.all([
            dbClient.aghanim_game.findMany({
                skip: skip,
                take: take,
            }),
            dbClient.aghanim_game.count(),


        ])
        const data = rawData.map(this.mapToGameType)

        return {data, total };
    }

    async getGamesByCustomer(page: number, pageSize: number, customerId: string): Promise<{ data: GameEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const companyIds = await
            dbClient.aghanim_company.findMany({
                where: {
                    customers: {
                    some: {
                        customer_id: customerId
                    }
                    }
                },
                select:{ id: true}
            })
        const companyIdsString = companyIds.map(company =>company.id);    

        const gamesData = await dbClient.aghanim_game.findMany({
            distinct: ['id'],
            where: {            
                company_id: {
                    in: companyIdsString
                }
            },
            
        })            
        

        const data = gamesData.map(this.mapToGameType);
        const total = gamesData.length;

        return { data, total };
    }

    
}

export const gameRepository = new GameRepository();