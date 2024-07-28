import { NextRequest, NextResponse } from 'next/server';
import { transactionsRepository } from '@/entities/transaction/_repositories/transaction';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');

    try {
        const data = await transactionsRepository.getTransactions(page, pageSize);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.error();
    }
}
