import { NextFetchEvent, NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (!req.nextUrl.pathname.startsWith("/api") && !req.nextUrl.pathname.startsWith("/_next")) {
        if (!req.url.includes("/login") && !req.cookies.get("shoecavecusecookie")) {
            console.log(req.url);
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }
}

export const config = {
    pages: ["/"],
}