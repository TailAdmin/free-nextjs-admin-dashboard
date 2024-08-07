// src/entities/transactions/_repositories/transactions.ts

import { BigQuery } from '@google-cloud/bigquery';
import { Transaction } from '../_domain/types';

const bigquery = new BigQuery();


const mapToTransactionType = (data: any): Transaction =>{

    const transactionData = {
        company_id: data.company_id,
        game_id: data.game_id,
        user_id: data.user_id,
        player_id: data.player_id,
        user_name: data.user_name,
        player_name: data.player_name,
        item_id: data.item_id,
        item_name: data.item_name,
        payment_id: data.payment_id,
        status: data.status,
        payment_method_id: data.payment_method_id,
        payment_method_name: data.payment_method_name,
        amount: data.amount,
        currency: data.currency,
        country: data.country,
        order_id: data.order_id,
        status_order: data.status_order,

    }

    return transactionData;
    
}

export class TransactionsRepository {


    async getTransactionsByFilter(page:number, pageSize:number, filter: Record<string, any>): Promise<{data: Transaction[], total: number}> {

        const filterFields = [
            'company_id', 'game_id', 'user_id', 'player_id', 'user_name',
            'player_name', 'item_id', 'item_name', 'payment_id', 'status',
            'payment_method_id', 'payment_method_name', 'amount', 'currency',
            'country', 'order_id', 'status_order'
        ];
        let whereCondition = '1=1'
        if (filter['selectedFields']){

            whereCondition = filterFields
                .map(field => `${field} LIKE '%${filter['selectedFields']}%'`)
                .join(' OR ');
        }

        console.log(`where condition repo: ${whereCondition}`);


        return this.getTransactions(page, pageSize, whereCondition);
    }
    async getTransactions(page:number, pageSize:number, whereCondition: string):Promise<{data: Transaction[], total: number}> {
        const offset = (page - 1) * pageSize;
        const query = `select * from events.payments WHERE ${whereCondition} limit @pageSize offset @offset`;
        const options = {query: query, params: {pageSize: pageSize, offset:offset}}
        const [rows] = await bigquery.query(options);
        const totalQuery = `
        SELECT COUNT(*) as total
        FROM events.payments
        WHERE ${whereCondition}`;

        console.log(`total query repo: ${totalQuery}`)
        const [totalRows] = await bigquery.query(totalQuery);
        console.log(`totalRows repo: ${totalRows}`)
        const total = totalRows[0].total;
        console.log(`total repo: ${total}`)
        return {data: rows.map(mapToTransactionType), total}
    }
}

export const transactionsRepository = new TransactionsRepository();
