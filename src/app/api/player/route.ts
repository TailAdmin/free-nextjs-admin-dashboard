import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/entities/user/_repositories/user';
import logger from '@/shared/utils/logger';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filterString = searchParams.get('filter');

    if (isNaN(page) || isNaN(pageSize)) {

        logger.error({
            msg: 'Player API Error. Invalid page or pageSize parameter',

        });
        return NextResponse.json({ success: false, error: 'Invalid page or pageSize parameter' }, { status: 400 });
    }
    let filter: Record<string, any> = {};
    if (filterString){
        try{
            filter = JSON.parse(filterString);
        } catch(error: unknown){

            if (error instanceof Error) {
                logger.error({
                    msg: 'Player API Error. Invalid json string',
                    error: error.message,
                    stack: error.stack,
                });
                return NextResponse.json({ success: false, message: 'Player API Error. Invalid json string' }, { status: 400 });

            }
            else{
                logger.error({msg: 'Player API Error. An unknown error occurred'});
                return NextResponse.json({ success: false, message: 'Player API Error. An unknown error occurred' }, { status: 500 });
            }

        }

    }

    try {
        let data, total;
        if (filter['gameId']){

            ( {data, total}  = await userRepository.getUserById(filter['gameId']));  
        } 
        else {
            ({data, total} = await userRepository.getUsersByFilter(page, pageSize, filter));
        }
        

        return NextResponse.json({ success: true, data, total });
    } catch (error: unknown) {


        if (error instanceof Error) {
            logger.error({
                msg: 'Player API Error. Players loading error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Player API Error. Players loading error'}, { status: 500 });

        } else{
                logger.error({msg: 'Player API Error. An unknown error occurred'});
                return NextResponse.json({ success: false, message: 'Player API Error. An unknown error occurred' }, { status: 500 });
        }


    }
}
