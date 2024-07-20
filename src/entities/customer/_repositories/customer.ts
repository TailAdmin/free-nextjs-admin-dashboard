import { dbClient } from "@/shared/lib/db";
import { CustomerEntity, CustomerId } from "../_domain/types";

export class CustomerRepository {
    async getCustomerById(CustomerId: CustomerId): Promise<CustomerEntity> {
        return dbClient.Customer.findUniqueOrThrow({
            where: {
                id: CustomerId,
            },
        });
    }
    async getCustomers(page: number, pageSize: number): Promise<{data: CustomerEntity[], total: number}> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const[data, total] = await Promise.all([
            dbClient.Customer.findMany({
                skip: skip,
                take: take,
            }),
            dbClient.Customer.count(),


        ])

        return {data, total };
    }
    

    async createCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
        return await dbClient.customer.create({
            data: customer,
        });
    }
}

export const customerRepository = new CustomerRepository();