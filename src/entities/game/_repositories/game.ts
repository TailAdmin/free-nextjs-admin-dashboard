import { dbClient } from "@/shared/lib/db";
import { GameEntity } from "../_domain/types";
import { Json } from "@google-cloud/bigquery";

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
    async getGames(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: GameEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
                
        const[rawData, total] = await Promise.all([
            dbClient.aghanim_game.findMany({
                skip: skip,
                take: take,
                where: whereCondition,
            }),
            dbClient.aghanim_game.count(),


        ])
        const data = rawData.map(this.mapToGameType)

        return {data, total };
    }
    async getGamesByFilter(page: number, pageSize: number, filter: Record<string, any>): Promise<{ data: GameEntity[], total: number }>{
        const whereCondition: Record<string, any> = {};
        if (filter['selectedFields']){
            
            whereCondition["OR"] =  [{'id': {contains: filter['selectedFields'], mode:'insensitive'}},
                            {'name': {contains: filter['selectedFields'], mode:'insensitive'}}
                            ]
        }
        if (filter["companyId"]){

            whereCondition["company_id"] = filter["companyId"]
                
                
            

            return this.getGamesByCompany(page, pageSize, whereCondition);
        }else if(filter["customerId"]){
            whereCondition["customers"] = {

                    some: {
                        customer_id: filter['customerId']
                    }
                
            }

            return this.getGamesByCustomer(page, pageSize, whereCondition);
        }else{
            return this.getGames(page, pageSize, whereCondition);
        }
        

    }
    async getGamesByCustomer(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{ data: GameEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const companyIds = await
            dbClient.aghanim_company.findMany({
                where: {
                    customers: whereCondition["customers"]
                },
                select:{ id: true}
            })
        const companyIdsString = companyIds.map(company =>company.id);    

        const gamesData = await dbClient.aghanim_game.findMany({
            distinct: ['id'],
            where: {            
                company_id: {
                    in: companyIdsString
                },
                'OR': whereCondition['OR']
            },
            
        })            

        const data = gamesData.map(this.mapToGameType);
        const total = gamesData.length;

        return { data, total };
    }

    async getGamesByCompany(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{ data: GameEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;  

        const gamesData = await dbClient.aghanim_game.findMany({
            distinct: ['id'],
            where: whereCondition,
            
        })            
        

        const data = gamesData.map(this.mapToGameType);
        const total = gamesData.length;

        return { data, total };
    }

    
}

export const gameRepository = new GameRepository();