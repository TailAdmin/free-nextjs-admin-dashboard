import { dbClient } from "@/shared/lib/db";
import { AccountEntity } from "../_domain/types";
import {convertDateStringToTimeStampInSeconds, convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"
import {decryptCBC } from "@/shared/utils/security";
import logger from '@/shared/utils/logger';

let customerMap: {[key: string]: string} = {};
let companyMap: { [key: string]: string } = {};

export class AccountRepository {



    mapToAccountType = (data: any): AccountEntity =>{
        const accountData = {

            id: data.id,
            company_id: data.company_id,
            details: decryptCBC(data.details),
            details_version: data.details_version,
            edited_by_customer_id: data.edited_by_customer_id,
            verify_state: data.verify_state,
            verified_at: convertTimeStampToLocaleDateString(data.verified_at),
            verified_by_customer_id: data.verified_by_customer_id,
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
            deleted_at: convertTimeStampToLocaleDateString(data.deleted_at),
            archived_at: convertTimeStampToLocaleDateString(data.archived_at),
            company_name: companyMap[data.company_id],
            edited_by_customer_name: decryptCBC(customerMap[data.edited_by_customer_id]),
            verified_by_customer_name: decryptCBC(customerMap[data.verified_by_customer_id]),
            
            company_link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}`


        }

        return accountData
    }

    async getAccountById(accountId: string): Promise<AccountEntity[]> {

        try
        {

            const rawData = await dbClient.aghanim_account.findUniqueOrThrow({
                where: {
                    id: accountId,
                },
            });

            const company = await dbClient.aghanim_company.findFirst({ where: { id:  rawData.company_id  } });
            let customer = await dbClient.aghanim_customer.findFirst({ where: { id:  rawData.edited_by_customer_id  } });
            
            if (company){
                companyMap[company.id] = company.name || '';
            }

            if (customer){
                customerMap[customer.id] = customer.name || '';
            }

            if (rawData.verified_by_customer_id && rawData.edited_by_customer_id !== rawData.verified_by_customer_id ){

                customer = await dbClient.aghanim_customer.findFirst({ where: { id:  rawData.verified_by_customer_id  } });
                if (customer){
                    customerMap[customer.id] = customer.name || '';
                }
            }

            let data = [this.mapToAccountType(rawData)];
            return data;
        }
        catch(error: unknown)
        {
            if (error instanceof Error){
                logger.error(
                    {msg:`Account Repository Error. Failed to retrieve account data for accountId: ${accountId}`, 
                    error: error.message,
                    stack: error.stack,
                });
            } else{

                logger.error({msg: 'Account Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve account data for accountId: ${accountId}`);
        }    
    

        
       
    }
    async getAccounts(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: AccountEntity[], total: number}> {
        
        try{
            const skip = (page - 1) * pageSize;
            const take = pageSize;
                    
            const [rawData, total] = await Promise.all([
                dbClient.aghanim_account.findMany({
                    skip: skip,
                    take: take,
                    where: whereCondition,
                    orderBy: {
                        created_at: 'desc', 
                      }
                }),
                dbClient.aghanim_account.count({where: whereCondition,})    
            ])


            const companyIds = [...new Set(rawData.map((row: any) => row.company_id).filter(value => value !==null))];
            const customerIds = [...new Set(rawData.map((row: any) => row.edited_by_customer_id).filter(value => value !==null)),
                                ...new Set(rawData.map((row: any) => row.verified_by_customer_id).filter(value => value !==null))
                            ];


            const [companies, customers] = await Promise.all([
                
                dbClient.aghanim_company.findMany({ where: { id: { in: companyIds } } }),
                dbClient.aghanim_customer.findMany({ where: { id: { in: customerIds } } }),

            ]);  

            companyMap = Object.fromEntries(companies.map((company: any) => [company.id, company.name]));
            customerMap = Object.fromEntries(customers.map((customer: any) => [customer.id, customer.name]));


            
            const data = rawData.map(this.mapToAccountType)

            return {data, total };
        }
        catch(error: unknown)
        {

            if (error instanceof Error){
                logger.error(
                    {msg: `Account Repository Error. Failed to retrieve account data for accounts`, 
                    error: error.message,
                    stack: error.stack,
                });
            } else{

                logger.error({msg: 'Account Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve account data for accounts`);
        }    
    }
    async getAccountsByFilter(page: number, pageSize: number, filter: Record<string, any>): Promise<{ data: AccountEntity[], total: number }> {
        const whereCondition: Record<string, any> = {};
        if (filter['selectedFields']){
            
            whereCondition["OR"] =  [
                            {'id': {contains: filter['selectedFields'], mode:'insensitive'}},
                            {'company_id': {contains: filter['selectedFields'], mode:'insensitive'}}
                            ]
        }
        if (filter['dateRange'] && filter['dateRange'][0]){

            whereCondition['created_at'] = {
                gte: convertDateStringToTimeStampInSeconds(filter['dateRange'][0]), 
                lte: convertDateStringToTimeStampInSeconds(filter['dateRange'][1], 'T23:59:59Z') , 
            };
        }


        return this.getAccounts(page, pageSize, whereCondition);
        
        

    }

    
}

export const accountRepository = new AccountRepository();