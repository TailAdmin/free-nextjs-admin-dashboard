import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/shared/utils/logger';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (req.nextUrl.pathname.startsWith('/api') && !token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!token && !req.nextUrl.pathname.startsWith('/api')) {

        const url = req.nextUrl.clone();
        url.pathname = '/api/auth/signin/auth0';
        return NextResponse.redirect(url);
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const currentIp = forwarded ? forwarded.split(',')[0].trim() : req.ip;

    
    const allowedIps = process.env.AGHANIM_ALLOWED_IPS ? JSON.parse(process.env.AGHANIM_ALLOWED_IPS) : [];

    if (currentIp && currentIp !== '::1' && 
        allowedIps && allowedIps.length > 0) {
        if (!allowedIps.includes(currentIp)){
            logger.warn(`User ${token?.name} with IP ${currentIp} is not allowed. Request rejected.`);
            return NextResponse.json({ message: 'IP is not allowed' }, { status: 403 });
        }
    } 
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api/auth/signin|api/auth/callback|_next/static|_next/image|favicon.ico).*)',

};
