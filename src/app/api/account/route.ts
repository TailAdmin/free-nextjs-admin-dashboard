import { NextRequest, NextResponse } from 'next/server';
import { accountRepository } from '@/entities/account/_repositories/account';
import logger from '@/shared/utils/logger';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = searchParams.get('filter');
    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error: unknown) {
            if (error instanceof Error) {
                logger.error({
                    msg: 'Account API Error. Invalid json string',
                    error: error.message,
                    stack: error.stack,
                });
                return NextResponse.json({ success: false, message: 'Account API Error. Invalid json string' }, { status: 400 });

            }
            else{
                logger.error('Account API Error. An unknown error occurred');
                return NextResponse.json({ success: false, message: 'Account API Error. An unknown error occurred' }, { status: 500 });
            }
            

        }

    }

    if (isNaN(page) || isNaN(pageSize)) {
        logger.error({
            msg: 'Account API Error. Invalid page or pageSize parameter',

        });
        return NextResponse.json({success: false, message: 'Account API Error. Invalid page or pageSize parameter' }, { status: 400 });
    }

    try {
        let data, total;
// if accountId was provided than it is single page (card)
        if (filter['accountId']){
            (data = await accountRepository.getAccountById(filter['accountId']));
            total = 1;
        } else {

            ({data, total} = await accountRepository.getAccountsByFilter(page, pageSize, filter));
        }

        return NextResponse.json({success: true, data, total });
    } catch (error: unknown) {

        if (error instanceof Error) {
            logger.error({
                msg: 'Account API Error. Accounts loading error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Account API Error. Accounts loading error'}, { status: 500 });

        }
        else{
            logger.error('Account API Error. An unknown error occurred');
            return NextResponse.json({ success: false, message: 'Account API Error. An unknown error occurred' }, { status: 500 });
        }

        
    }
}
