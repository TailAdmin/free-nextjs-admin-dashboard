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
    async getCustomerById(CustomerId: string): Promise<CustomerEntity> {

        const rawData = dbClient.aghanim_customer.findUniqueOrThrow({
            where: {
                id: CustomerId,
            },
        });
        return this.mapToCustomerType(rawData);
    }
    async getCustomers(page: number, pageSize: number): Promise<{data: CustomerEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;


        try {
            await dbClient.$connect();
            console.log('Database server is accessible.');
          } catch (error) {
            console.error('Error connecting to the database server:', error);
          } finally {
            await dbClient.$disconnect();
          }
        
        const[rawData, total] = await Promise.all([
            dbClient.aghanim_customer.findMany({
                skip: skip,
                take: take,
            }),
            dbClient.aghanim_customer.count(),


        ])

        const data = rawData.map(this.mapToCustomerType)

        return {data, total };
    }
    

    // async createCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
    //     return await dbClient.customer.create({
    //         data: customer,
    //     });
    // }
}

export const customerRepository = new CustomerRepository();