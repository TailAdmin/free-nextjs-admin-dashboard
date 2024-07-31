import { NextRequest, NextResponse } from 'next/server';
import { companyRepository } from '@/entities/company/_repositories/company';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(request.url);
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = String(searchParams.get('filter'));

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
        console.log(JSON.stringify(filter))
        if (filter['companyId']){
            (data = await companyRepository.getCompanyById(filter['companyId']));
            total = 1;
            console.log(data)
        } else if(filter['customerId']){
            ({ data, total } = await companyRepository.getCompaniesByCustomer(page, pageSize,filter['customerId']));
        }else{
            ({ data, total } = await companyRepository.getCompanies(page, pageSize));

        }


        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Error loading companies', error);
        return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
    }
}
