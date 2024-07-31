import { dbClient } from "@/shared/lib/db";
import { CustomerEntity } from "../_domain/types";

export class CustomerRepository {



    mapToCustomerType = (data: any): CustomerEntity =>{
        const customerData = {

            id: data.id,
            name: data.name,
            email: data.email,
            sub: data.sub,
            accepted_terms_version: data.accepted_terms_version,
            accepted_terms_at: data.accepted_terms_at,
            accepted_privacy_version: data.accepted_privacy_version,
            accepted_privacy_at: data.accepted_privacy_at,
            is_staff: data.is_staff,
            created_at: data.created_at,
            modified_at: data.modified_at,
            deleted_at: data.deleted_at,
            last_login_at: data.last_login_at,
            archived_at: data.archived_at,

        }

        return customerData
    }
    async getCustomerById(customerId: string): Promise<{data:CustomerEntity[], total: number}> {
        const total = 1;
        const rawData = await dbClient.aghanim_customer.findUnique({
            where: {
                id: customerId,
            },
        });
        const data = [this.mapToCustomerType(rawData)];
        return {data, total};
    }
    async getCustomers(page: number, pageSize: number): Promise<{data: CustomerEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        
        const[rawData, total] = await Promise.all([
            dbClient.aghanim_customer.findMany({
                skip: skip,
                take: take,
            }),
            dbClient.aghanim_customer.count(),


        ])

        const data = rawData.map(this.mapToCustomerType)
        console.log(data);

        return {data, total };
    }
    

    async getCustomersByCompany(page: number, pageSize: number, companyId: string): Promise<{ data: CustomerEntity[], total: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [rawData, total] = await Promise.all([
            dbClient.aghanim_customer.findMany({
                where: {
                    companies: {
                    some: {
                        company_id: companyId
                    }
                    }
                }
            }),
            dbClient.aghanim_customer.count({
                where: {
                    companies: {
                    some: {
                        company_id: companyId
                    }
                    }
                }
            }),
        ]);

        const data = rawData.map(this.mapToCustomerType);
 

        return { data, total };
    }
}

export const customerRepository = new CustomerRepository();