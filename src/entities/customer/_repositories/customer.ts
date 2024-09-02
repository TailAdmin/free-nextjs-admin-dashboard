import { dbClient } from "@/shared/lib/db";
import { CustomerEntity } from "../_domain/types";
import { decryptCBC, encryptCBC } from "@/shared/utils/security";
import {convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"
import logger from "@/shared/utils/logger";

export class CustomerRepository {



    mapToCustomerType = (data: any): CustomerEntity =>{
        const customerData = {

            id: data.id,
            name: decryptCBC(data.name),
            email: decryptCBC(data.email),
            sub: data.sub,
            accepted_terms_version: data.accepted_terms_version,
            accepted_terms_at: convertTimeStampToLocaleDateString(data.accepted_terms_at),
            accepted_privacy_version: data.accepted_privacy_version,
            accepted_privacy_at: convertTimeStampToLocaleDateString(data.accepted_privacy_at),
            is_staff: data.is_staff ? 'Yes' : 'No',
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
            deleted_at: convertTimeStampToLocaleDateString(data.deleted_at),
            last_login_at: convertTimeStampToLocaleDateString(data.last_login_at),
            archived_at: convertTimeStampToLocaleDateString(data.archived_at),
            avatar_url: data.avatar_url,

        }

        return customerData
    }
    async getCustomerById(customerId: string): Promise<{data:CustomerEntity[], total: number}> {
        
        try{
            const total = 1;
            const rawData = await dbClient.aghanim_customer.findUnique({
                where: {
                    id: customerId,
                },
            });
            const data = [this.mapToCustomerType(rawData)];
            return {data, total};
        }    catch(error: unknown)  {

            if (error instanceof Error){
                logger.error({
                        msg: `Customer Repository Error. Failed to retrieve Customer data for customerId: ${customerId}`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg: 'Customer Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Customer data for customerId: ${customerId}`);


        }  
    }
    async getCustomers(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: CustomerEntity[], total: number}> {
        try{
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            
            const[rawData, total] = await Promise.all([
                dbClient.aghanim_customer.findMany({
                    skip: skip,
                    take: take,
                    where: whereCondition
                }),
                dbClient.aghanim_customer.count({where: whereCondition,}),

            ])

            const data = rawData.map(this.mapToCustomerType)

            return {data, total };
        }catch (error: unknown){

            if (error instanceof Error){
                logger.error(
                    {
                        msg: `Customer Repository Error. Failed to retrieve Customer data for customers`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg: 'Customer Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Customer data for customers`);
        }    
    }
    
    async getCustomersByFilter(page: number, pageSize: number, filter: Record<string, any>): Promise<{ data: CustomerEntity[], total: number }> {
        const whereCondition: Record<string, any> = {};

        if (filter['selectedFields']){
            
            whereCondition["OR"] =  [{'id': {contains: filter['selectedFields'], mode:'insensitive'}},
                            {'name': {contains: encryptCBC(filter['selectedFields']), mode:'insensitive'}},
                            {'email': {contains: encryptCBC(filter['selectedFields']), mode:'insensitive'}}
                            ]
        }
        if (filter["companyId"]){

            whereCondition["companies"] = {

                some: {
                    company_id: filter["companyId"]
                }
                
            }


            return this.getCustomersByCompany(page, pageSize, whereCondition);
        }else{

            return this.getCustomers(page, pageSize, whereCondition);
        }
        

    }
    async getCustomersByCompany(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{ data: CustomerEntity[], total: number }> {

        try{
            const skip = (page - 1) * pageSize;
            const take = pageSize;

            const [rawData, total] = await Promise.all([
                dbClient.aghanim_customer.findMany({
                    skip: skip,
                    take: take,
                    where: whereCondition
                }),
                dbClient.aghanim_customer.count({
                    where: whereCondition
                }),
            ]);

            const data = rawData.map(this.mapToCustomerType);
    

            return { data, total };
        }catch(error: unknown) {

            if (error instanceof Error){
                logger.error(
                    {msg:`Customer Repository Error. Failed to retrieve Customer data for companyId`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg:'Customer Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Customer data for companyId`);
        }      
    }
}

export const customerRepository = new CustomerRepository();