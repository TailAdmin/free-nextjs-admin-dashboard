import { dbClient } from "@/shared/lib/db";
import { GameEntity } from "../_domain/types";
import { Json } from "@google-cloud/bigquery";
import { convertTimeStampToLocaleDateString } from "@/shared/utils/commonUtils";

export class GameRepository {



    mapToGameType = (data: any): GameEntity =>{


        const gameData = {


            id: data.id,
            name: data.name,
            company_id: data.company_id,
            company_name: data.company ? data.company.name : undefined, 

            description: data.description,
            url: data.url,
            logo_url: data.logo_url,
            login_type: data.login_type,
            social_medias: data.social_medias,
            game_stores: data.game_stores,
            login_settings: data.login_settings,
            locale_default: data.locale_default,
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
            deleted_at: convertTimeStampToLocaleDateString(data.deleted_at),
            archived_at: convertTimeStampToLocaleDateString(data.archived_at),
            company_link:`${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}`


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
                include: {
                    company: true
                },
            }),
            dbClient.aghanim_game.count({
                where: whereCondition,
            }),


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
            skip: skip,
            take: take,
            where: {            
                company_id: {
                    in: companyIdsString
                },
                'OR': whereCondition['OR']
            },
            include: {
                company: true
            },
            
        })            

        const data = gamesData.map(this.mapToGameType);
        const total = await dbClient.aghanim_game.count({
            where: {            
                company_id: {
                    in: companyIdsString
                },
                'OR': whereCondition['OR']
            },
            
            
        })            
        return { data, total };
    }

    async getGamesByCompany(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{ data: GameEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;  

        const gamesData = await dbClient.aghanim_game.findMany({
            skip: skip,
            take: take,
            where: whereCondition,
            include: {
                company: true
            },
            
        })            
        

        const data = gamesData.map(this.mapToGameType);
        const total = await dbClient.aghanim_game.count({

            where: whereCondition,
            
        })            

        return { data, total };
    }

    
}

export const gameRepository = new GameRepository();