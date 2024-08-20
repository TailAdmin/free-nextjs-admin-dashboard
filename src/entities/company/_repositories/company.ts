import { dbClient } from "@/shared/lib/db";
import { CompanyEntity } from "../_domain/types";
import {convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"

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

        }


        return companyData
    }

    async getCompanyById(companyId: string): Promise<CompanyEntity[]> {
        console.log(`repo company ID: ${companyId}`);
        const rawData = await dbClient.aghanim_company.findUniqueOrThrow({
            where: {
                id: companyId,
            },
        });


        let data = [this.mapToCompanyType(rawData)];
        

        
        return data;
    }
    async getCompanies(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: CompanyEntity[], total: number}> {
        
        //console.log("where: " + JSON.stringify(whereCondition));
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
    }

    
}

export const companyRepository = new CompanyRepository();