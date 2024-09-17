import { NextRequest, NextResponse } from 'next/server';
import { settingsRepository } from '@/entities/settings/_repositories/settings';
import logger from '@/shared/utils/logger';

export async function GET(request: NextRequest) {


    try {
        let data;
        data = await settingsRepository.getSettings();

  

        return NextResponse.json({success: true, data: [data] });
    } catch (error: unknown) {

        if (error instanceof Error) {
            logger.error({
                msg: 'Settings API Error. Settings loading error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Settings API Error. Settings loading error'}, { status: 500 });

        }
        else{
            logger.error('Settings API Error. An unknown error occurred');
            return NextResponse.json({ success: false, message: 'Settings API Error. An unknown error occurred' }, { status: 500 });
        }

        
    }
}

export async function PATCH(request: NextRequest){
    try{
        const {dataId, data} = await request.json();

        const updatedData = settingsRepository.updateSettings(dataId, data);

        return NextResponse.json({success: true, data: updatedData, message: 'Settings API. Data saved'}, { status: 200 });

    }catch(error: unknown){
        if (error instanceof Error) {
            logger.error({
                msg: 'Settings API Error. Data saving error',
                error: error.message,
                stack: error.stack,
            });
            return NextResponse.json({ success: false, message: 'Settings API Error. Data saving error'}, { status: 500 });

        }
        else{
            logger.error('Settings API Error. An unknown error occurred');
            return NextResponse.json({ success: false, message: 'Settings API Error. An unknown error occurred' }, { status: 500 });
        }
    }      
    
}
