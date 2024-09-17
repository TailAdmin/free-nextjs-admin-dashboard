import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (req.nextUrl.pathname.startsWith('/api') && !token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const ip = req.headers.get('x-forwarded-for') || req.ip;

      console.log('IP Address:', ip); 

    if (!token && !req.nextUrl.pathname.startsWith('/api')) {

        const url = req.nextUrl.clone();
        url.pathname = '/api/auth/signin/auth0';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api/auth/signin|api/auth/callback|_next/static|_next/image|favicon.ico).*)',

};
