import { dbClient } from "@/shared/lib/db";
import { CompanyEntity } from "../_domain/types";
import {convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"
import logger from "@/shared/utils/logger";

export class CompanyRepository {



    mapToCompanyType = (data: any): CompanyEntity =>{
        const companyData = {

            id: data.id,
            name: data.name,
            url: data.url,
            size: data.size,
            domains: data.domains,
            viewer_domains: data.viewer_domains,
            logo_url: data.logo_url,
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
            deleted_at: convertTimeStampToLocaleDateString(data.deleted_at),
            archived_at: convertTimeStampToLocaleDateString(data.archived_at),
            company_link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.id}`

        }


        return companyData
    }

    async getCompanyById(companyId: string): Promise<CompanyEntity[]> {
        try{
            const rawData = await dbClient.aghanim_company.findUniqueOrThrow({
                where: {
                    id: companyId,
                },
            });


            let data = [this.mapToCompanyType(rawData)];
            

            
            return data;
        } catch(error: unknown)  {

            if (error instanceof Error){
                logger.error({
                        msg: `Company Repository Error. Failed to retrieve Company data for companyId: ${companyId}`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg: 'Company Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Company data for companyId: ${companyId}`);


        }  
    }
    async getCompanies(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: CompanyEntity[], total: number}> {
        
        try{
            const skip = (page - 1) * pageSize;
            const take = pageSize;
                    
            const [rawData, total] = await Promise.all([
                dbClient.aghanim_company.findMany({
                    skip: skip,
                    take: take,
                    where: whereCondition,
                }),
                dbClient.aghanim_company.count({where: whereCondition,})    
            ])
            
            const data = rawData.map(this.mapToCompanyType)

            return {data, total };
        } catch (error: unknown){

            if (error instanceof Error){
                logger.error(
                    {
                        msg: `Company Repository Error. Failed to retrieve Company data for companies`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg: 'Company Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Company data for companies`);
        }

    }
    async getCompaniesByFilter(page: number, pageSize: number, filter: Record<string, any>): Promise<{ data: CompanyEntity[], total: number }> {
        const whereCondition: Record<string, any> = {};
        if (filter['selectedFields']){
            
            whereCondition["OR"] =  [
                            {'name': {contains: filter['selectedFields'], mode:'insensitive'}}
                            ]
        }
        if (filter["customerId"]){

            whereCondition["customers"] = {

                some: {
                    customer_id: filter["customerId"]
                }
                
            }

            return this.getCompaniesByCustomer(page, pageSize, whereCondition);
        }else{

            return this.getCompanies(page, pageSize, whereCondition);
        }

    }

    async getCompaniesByCustomer(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{ data: CompanyEntity[], total: number }> {
        
        try{
            const skip = (page - 1) * pageSize;
            const take = pageSize;

            const [rawData, total] = await Promise.all([
                dbClient.aghanim_company.findMany({
                    skip: skip,
                    take: take,
                    where: whereCondition
                }),
                dbClient.aghanim_company.count({
                    where: whereCondition,
                }),
            ]);

            const data = rawData.map(this.mapToCompanyType);
    

            return { data, total };
        } catch(error: unknown) {

            if (error instanceof Error){
                logger.error(
                    {msg:`Company Repository Error. Failed to retrieve Company data for customerId`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg:'Company Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Company data for customerId`);
        }   
    }

    
}

export const companyRepository = new CompanyRepository();