import { NextRequest, NextResponse } from 'next/server';
import logger from '@/shared/utils/logger';

export async function POST(request: NextRequest) {
    try {

        
        const { user, message } = await request.json();

        if (!user || !message) {
            logger.error({msg: 'Log API error. Invalid parameters'});
            return NextResponse.json({success: false, message: 'Log API error. Invalid parameters'}, { status: 400 });
        }
        logger.info({ msg: message, userData: user });
        return NextResponse.json({success: true,message: 'Log API. Log saved'}, { status: 200 });
    }
    catch(error: unknown){
        if (error instanceof Error) {
            logger.error({
                msg: 'Log API Error. Log saving error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Log API Error. Log saving error'}, { status: 500 });

        }
        else{
            logger.error('Log API Error. An unknown error occurred');
            return NextResponse.json({ success: false, message: 'Log API Error. An unknown error occurred' }, { status: 500 });
        }
    }    


}