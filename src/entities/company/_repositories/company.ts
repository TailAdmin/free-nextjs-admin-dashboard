import { dbClient } from "@/shared/lib/db";
import { CompanyEntity } from "../_domain/types";

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
            created_at: data.created_at,
            modified_at: data.modified_at,
            deleted_at: data.deleted_at,
            archived_at: data.archived_at,

        }

        return companyData
    }
    async getCompanyById(CustomerId: string): Promise<CompanyEntity> {

        const rawData = dbClient.aghanim_company.findUniqueOrThrow({
            where: {
                id: CustomerId,
            },
        });
        
        return this.mapToCompanyType(rawData);;
    }
    async getCompanies(page: number, pageSize: number): Promise<{data: CompanyEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
                
        const[rawData, total] = await Promise.all([
            dbClient.aghanim_company.findMany({
                skip: skip,
                take: take,
            }),
            dbClient.aghanim_company.count(),


        ])
        const data = rawData.map(this.mapToCompanyType)

        return {data, total };
    }

    async getCompaniesByCustomer(page: number, pageSize: number, customerId: string): Promise<{ data: CompanyEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const filter = { id: customerId }; 

        const [rawData, total] = await Promise.all([
            dbClient.aghanim_company.findMany({
                where: {
                    customers: {
                    some: {
                        customer_id: customerId
                    }
                    }
                }
            }),
            dbClient.aghanim_company.count({
                where: filter,
            }),
        ]);

        const data = rawData.map(this.mapToCompanyType);
 

        return { data, total };
    }

    
}

export const companyRepository = new CompanyRepository();