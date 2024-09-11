import { NextRequest, NextResponse } from 'next/server';
import { companyRepository } from '@/entities/company/_repositories/company';
import logger from '@/shared/utils/logger';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = searchParams.get('filter');
    let filter: Record<string, any> = {};

    if (isNaN(page) || isNaN(pageSize)) {
        logger.error({
            msg: 'Company API Error. Invalid page or pageSize parameter',

        });
        return NextResponse.json({success: false, error: 'Company API Error. Invalid page or pageSize parameter' }, { status: 400 });
    }

    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error){

            if (error instanceof Error) {
                logger.error({
                    msg: 'Company API Error. Invalid json string',
                    error: error.message,
                    stack: error.stack,
                });
                return NextResponse.json({ success: false, message: 'Company API Error. Invalid json string' }, { status: 400 });

            }
            else{
                logger.error({msg: 'Company API Error. An unknown error occurred'});
                return NextResponse.json({ success: false, message: 'Company API Error. An unknown error occurred' }, { status: 500 });
            }


        }

    }

    try {
        let data, total;

        if (filter['companyId']){
            (data = await companyRepository.getCompanyById(filter['companyId']));
            total = 1;
        } else {

            ({data, total} = await companyRepository.getCompaniesByFilter(page, pageSize, filter));
        }

        return NextResponse.json({ success: true, data, total });
    } catch (error) {


        if (error instanceof Error) {
            logger.error({
                msg: 'Company API Error. Companies loading error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Company API Error. Companies loading error'}, { status: 500 });

        } else{
                logger.error({msg: 'Company API Error. An unknown error occurred'});
                return NextResponse.json({ success: false, message: 'Company API Error. An unknown error occurred' }, { status: 500 });
        }

    }
}
