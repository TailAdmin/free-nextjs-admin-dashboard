import { NextRequest, NextResponse } from 'next/server';
import { transactionsRepository } from '@/entities/transaction/_repositories/transaction';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const filterString = searchParams.get('filter');

    if (isNaN(page) || isNaN(pageSize)) {
        return NextResponse.json({ success: false, error: 'Invalid page or pageSize parameter' }, { status: 400 });
    }
    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error){
            return NextResponse.json({success: false, error: 'Invalid json parametr' }, { status: 400 });

        }

    }

    try {

        let data, total;

        ({ data, total } = await transactionsRepository.getTransactionsByFilter(page, pageSize, filter))
        return NextResponse.json({success: true, data, total });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ success: false, error: 'Failed to load transactions' }, { status: 500 });
    }
}
