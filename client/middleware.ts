import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, profile, refresh } from './api/auth';

export async function middleware(req: NextRequest) {
    const session = await getSession();

    if ( (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/") && session ) {
        console.log("Ya estás logueado");
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if ( (req.nextUrl.pathname.startsWith("/home") ||
            req.nextUrl.pathname.startsWith("/welcome") ||
            req.nextUrl.pathname.startsWith("/clusters") ||
            req.nextUrl.pathname.startsWith("/users/")) && !session ) {
        console.log("No estas logueado");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}
