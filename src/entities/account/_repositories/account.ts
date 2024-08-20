import { dbClient } from "@/shared/lib/db";
import { AccountEntity } from "../_domain/types";
import {convertTimeStampToLocaleDateString} from "@/shared/utils/commonUtils"
import { decryptECB } from "@/shared/utils/security";

export class AccountRepository {



    mapToAccountType = (data: any): AccountEntity =>{
        const accountData = {

            id: data.id,
            company_id: data.company_id,
            details: decryptECB(data.details),
            details_version: data.details_version,
            edited_by_customer_id: data.edited_by_customer_id,
            verify_state: data.verify_state,
            verified_at: convertTimeStampToLocaleDateString(data.verified_at),
            verified_by_customer_id: data.verified_by_customer_id,
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
            deleted_at: convertTimeStampToLocaleDateString(data.deleted_at),
            archived_at: convertTimeStampToLocaleDateString(data.archived_at),
            link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}`


        }

        return accountData
    }

    async getAccountById(accountId: string): Promise<AccountEntity[]> {

        const rawData = await dbClient.aghanim_company.findUniqueOrThrow({
            where: {
                id: accountId,
            },
        });


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