import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      select: { id: true, name: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
