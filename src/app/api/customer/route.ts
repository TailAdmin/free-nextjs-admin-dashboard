import { NextRequest, NextResponse } from 'next/server';
import { customerRepository } from '@/entities/customer/_repositories/customer';

export async function GET(request: NextRequest) {


    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = searchParams.get('filter');

    if (isNaN(page) || isNaN(pageSize)) {
        return NextResponse.json({ success: false, error: 'Invalid page or pageSize parameter' }, { status: 400 });
    }

    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error){
            return NextResponse.json({ success: false, error: 'Invalid json parametr' }, { status: 400 });

        }

    }

    try {
        let data, total;

        if (filter['customerId']){

            ( {data, total}  = await customerRepository.getCustomerById(filter['customerId']));  
        } 
        else {

            ({data, total} = await customerRepository.getCustomersByFilter(page, pageSize, filter));
        }

        
        return NextResponse.json({success: true, data, total });
    } catch (error) {
        console.error('Error loading customers', error);
        return NextResponse.json({ success: false, error: 'Failed to load customers' }, { status: 500 });
    }
}
