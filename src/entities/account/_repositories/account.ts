import { dbClient } from "@/shared/lib/db";
import { AccountEntity } from "../_domain/types";
import {convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"
import { decryptECB, decryptCBC } from "@/shared/utils/security";

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
            edited_by_customer_name: decryptECB(customerMap[data.edited_by_customer_id]),
            verified_by_customer_name: decryptECB(customerMap[data.verified_by_customer_id]),
            
            company_link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}`


        }

        return accountData
    }

    async getAccountById(accountId: string): Promise<AccountEntity[]> {

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
    async getAccounts(page: number, pageSize: number, whereCondition: Record<string, any>): Promise<{data: AccountEntity[], total: number}> {
        
        const skip = (page - 1) * pageSize;
        const take = pageSize;
                
        const [rawData, total] = await Promise.all([
            dbClient.aghanim_account.findMany({
                skip: skip,
                take: take,
                where: whereCondition,
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
    async getAccountsByFilter(page: number, pageSize: number, filter: Record<string, any>): Promise<{ data: AccountEntity[], total: number }> {
        const whereCondition: Record<string, any> = {};
        if (filter['selectedFields']){
            
            whereCondition["OR"] =  [
                            {'id': {contains: filter['selectedFields'], mode:'insensitive'}}
                            ]
        }

        return this.getAccounts(page, pageSize, whereCondition);
        
        

    }

    
}

export const accountRepository = new AccountRepository();