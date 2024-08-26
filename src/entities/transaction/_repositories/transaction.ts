// src/entities/transactions/_repositories/transactions.ts

import { BigQuery } from '@google-cloud/bigquery';
import { Transaction } from '../_domain/types';
import { decryptECB, encryptECB } from "@/shared/utils/security";
import { convertTimeStampToLocaleDateString, convertISODateToLocaleDateString, convertDateStringToTimeStampInSeconds } from '@/shared/utils/commonUtils';
import { dbClient } from '@/shared/lib/db';

const bigquery = new BigQuery();
let companyMap: [];
let gameMap: [];

export class TransactionsRepository {

    AGHANIM_DASHBOARD_URL = process.env.AGHANIM_DASHBOARD_LINK;

    mapToTransactionType = (data: any): Transaction =>{

        //console.log('companyMap', companyMap)
        const transactionData = {
            company_id: data.company_id,
            game_id: data.game_id,
            user_id: data.user_id,
            company_name: companyMap[data.company_id],
            game_name: gameMap[data.game_id],
            player_id: data.player_id,
            user_name: decryptECB(data.user_name),
            player_name: decryptECB(data.player_name),
            item_id: data.item_id,
            item_name: data.item_name,
            payment_id: data.payment_id,
            status: data.status,
            payment_method_id: data.payment_method_id,
            payment_method_name: data.payment_method_name,
            amount: data.amount,
            amountWithCurrency: `${data.amount} ${data.currency}`, 
            currency: data.currency,
            country: data.country,
            order_id: data.order_id,
            status_order: data.status_order,
            fail_reason: data.fail_reason,
            fail_reason_code: data.fail_reason_code,
            total_usd: data.total_usd,
            campaign_id: data.campaign_id,
            user_campaign_id: data.user_campaign_id,
            total_usd_revenue: data.total_usd_revenue,
            wht_rate: data.wht_rate,
            last_status: data.last_status,
            user_billing_address: decryptECB(data.user_billing_address),
            discounts: data.discounts,
            user_local_price: data.user_local_price,
            device_type: data.device_type,
            total_order_currency: data.total_order_currency,
            total_order_currency_billing: data.total_order_currency_billing,
            ps_fail_reason_code: data.ps_fail_reason_code,
            state: data.state,
            ps_tx_id: data.ps_tx_id,
            payment_number: data.payment_number,
            paylink_user_id: data.paylink_user_id,
            card_last_4_digits: data.card_last_4_digits,
            card_bin: data.card_bin,
            card_schemes: data.card_schemes,
            total: data.total,
            currency_minor_unit: data.currency_minor_unit,
            fees: data.fees,
            taxes: data.taxes,
            ip: data.ip,
            created_at: convertTimeStampToLocaleDateString(data.created_at),
            attributes: data.attributes,
            subscription_name: data.subscription_name,
            message_id: data.message_id,
            publish_time: data.publish_time,
            billing_email: decryptECB(data.billing_email),
            payment_date: convertISODateToLocaleDateString(data.payment_date['value']),
            datahouse_user_id: data.datahouse_user_id,
            payment_link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}/${data.game_id}/transactions/${data.payment_number}`,
            game_link: `${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}/${data.game_id}`,
            company_link:`${process.env.AGHANIM_DASHBOARD_URL}/company/${data.company_id}`

        }
    
        return transactionData;
        
    }

    async getTransactionsByFilter(page:number, pageSize:number, filter: Record<string, any>): Promise<{data: Transaction[], total: number}> {

        const filterFields = [
            'user_id',            
            'billing_email', "payment_number",
        ];
        let whereCondition = '1=1'
        if (filter['selectedFields']){
            
            const encryptedField = encryptECB(filter['selectedFields']);
            

            whereCondition = `  user_id LIKE '%${filter['selectedFields']}%'
                                OR payment_number LIKE '%${filter['selectedFields']}%'
                                OR billing_email = '${encryptedField}'
                                OR user_name = '${encryptedField}'`

        }

        if (filter['payment_date'] && filter['payment_date'][0] && filter['payment_date'][1]) {
            const start = filter['payment_date'][0];
            const end = filter['payment_date'][1];
            const startTS = convertDateStringToTimeStampInSeconds(start);
            const endTS = (start !== end) ? convertDateStringToTimeStampInSeconds(end) : convertDateStringToTimeStampInSeconds(end, 'T23:59:59Z'); ;
            whereCondition += ` AND payment_date >= TIMESTAMP_SECONDS(${startTS}) AND payment_date <= TIMESTAMP_SECONDS(${endTS})`;
        }
        //console.log('whereCondition', whereCondition);

        return this.getTransactions(page, pageSize, whereCondition);
    }
    async getTransactions(page:number, pageSize:number, whereCondition: string):Promise<{data: Transaction[], total: number}> {

        const offset = (page - 1) * pageSize;
        const query = `select * from events.payments WHERE ${whereCondition} ORDER BY payment_date DESC limit @pageSize offset @offset`;
        const options = {query: query, params: {pageSize: pageSize, offset:offset}}
        const [rows] = await bigquery.query(options);
        const totalQuery = `
        SELECT COUNT(*) as total
        FROM events.payments
        WHERE ${whereCondition}`;

        const companyIds = [...new Set(rows.map((row: any) => row.company_id))];
        const gameIds = [...new Set(rows.map((row: any) => row.game_id))];

        const [companies, games] = await Promise.all([
            dbClient.aghanim_company.findMany({ where: { id: { in: companyIds } } }),
            dbClient.aghanim_game.findMany({ where: { id: { in: gameIds } } }),

        ]);  

        companyMap = Object.fromEntries(companies.map((company: any) => [company.id, company.name]));
        gameMap = Object.fromEntries(games.map((game: any) => [game.id, game.name]));

        //console.log(`total query repo: ${totalQuery}`)
        const [totalRows] = await bigquery.query(totalQuery);
        //console.log(`totalRows repo: ${totalRows}`)
        const total = totalRows[0].total;
        //console.log(`total repo: ${total}`)
        return {data: rows.map(this.mapToTransactionType), total}
    }
}

export const transactionsRepository = new TransactionsRepository();
