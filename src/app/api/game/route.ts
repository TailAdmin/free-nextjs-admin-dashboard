import { NextRequest, NextResponse } from 'next/server';
import { gameRepository } from '@/entities/game/_repositories/game';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
