import { NextRequest, NextResponse } from 'next/server';
import { accountRepository } from '@/entities/account/_repositories/account';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = searchParams.get('filter');

    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error){
            return NextResponse.json({ error: 'Invalid json parametr' }, { status: 400 });

        }

    }

    if (isNaN(page) || isNaN(pageSize)) {
        return NextResponse.json({ error: 'Invalid page or pageSize parameter' }, { status: 400 });
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
    } catch (error) {
        console.error('Error loading accounts', error);
        return NextResponse.json({success: false, error: 'Failed to load accounts' }, { status: 500 });
    }
}
