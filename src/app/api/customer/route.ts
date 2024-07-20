import { NextRequest, NextResponse } from 'next/server';
import { customerRepository } from '@/entities/customer/_repositories/customer';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;

    try {
        const { data, total } = await customerRepository.getCustomers(page, pageSize);
        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Error loading customers', error);
        return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
    }
}
