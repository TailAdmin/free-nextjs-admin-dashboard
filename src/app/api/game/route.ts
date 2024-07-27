import { NextRequest, NextResponse } from 'next/server';
import { gameRepository } from '@/entities/game/_repositories/game';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const filter = String(searchParams.get('filter'));

    try {
        let data, total;
        console.log(filter);
        if (typeof filter !== "undefined"){
            ({ data, total } = await gameRepository.getGamesByCustomer(page, pageSize, filter))
        } else {
            console.log(filter);
        ({ data, total } = await gameRepository.getGames(page, pageSize));
        }

        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Error loading companies', error);
        return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
    }
}
