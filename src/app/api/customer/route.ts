import { NextRequest, NextResponse } from 'next/server';
import { customerRepository } from '@/entities/customer/_repositories/customer';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = String(searchParams.get('customerId'));

    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error){
            return NextResponse.json({ error: 'Invalid json parametr' }, { status: 400 });

        }

    }

    try {
        let data, total;

        if (filter['customerId']){

            ( {data, total}  = await customerRepository.getCustomerById(filter['customerId']));  
        } else if(filter['companyId']){
            ( {data, total}  = await customerRepository.getCustomersByCompany(page, pageSize,filter['companyId']));  

        } else {

            ({ data, total } = await customerRepository.getCustomers(page, pageSize));
        }
        
        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Error loading customers', error);
        return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
    }
}
