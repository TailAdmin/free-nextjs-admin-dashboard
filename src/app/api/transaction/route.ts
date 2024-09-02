import { NextRequest, NextResponse } from 'next/server';
import { transactionsRepository } from '@/entities/transaction/_repositories/transaction';
import logger from '@/shared/utils/logger';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const filterString = searchParams.get('filter');

    if (isNaN(page) || isNaN(pageSize)) {

        logger.error({
            msg: 'Transaction API Error. Invalid page or pageSize parameter',
        });

        return NextResponse.json({ success: false, error: 'Transaction API Error. Invalid page or pageSize parameter' }, { status: 400 });
    }
    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error: unknown) {
            if (error instanceof Error) {
                logger.error({
                    msg: 'Transaction API Error. Invalid json string',
                    error: error.message,
                    stack: error.stack,
                });
                return NextResponse.json({ success: false, message: 'Transaction API Error. Invalid json string' }, { status: 400 });

            }
            else{
                logger.error('Transaction API Error. An unknown error occurred');
                return NextResponse.json({ success: false, message: 'Transaction API Error. An unknown error occurred' }, { status: 500 });
            }
        }    

    }

    try {

        const { data, total } = await transactionsRepository.getTransactionsByFilter(page, pageSize, filter)
        return NextResponse.json({success: true, data, total });
    } catch (error) {
        if (error instanceof Error) {
            logger.error({
                msg: 'Transaction API Error. Failed to load transactions',
                error: error.message,
                stack: error.stack,
            });
        }
        else{
            logger.error('Transaction API Error. An unknown error occurred');
        }

        return NextResponse.json({ success: false, error: 'Transaction API Error. Failed to load transactions' }, { status: 500 });
    }
}
