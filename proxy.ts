import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import {
    getPathLocale,
    LOCALE_HEADER,
    negotiateLocale,
    withLocalePath,
} from '@/app/lib/i18n/routing';

const isPublicRoute = createRouteMatcher([
    '/vi/sign-in(.*)',
    '/en/sign-in(.*)',
])

const isApiRoute = createRouteMatcher([
    '/api(.*)',
    '/trpc(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl
    const pathLocale = getPathLocale(pathname)
    const isApi = isApiRoute(req)

    if (!isApi && !pathLocale) {
        const locale = negotiateLocale(req.headers.get('accept-language'))
        const url = req.nextUrl.clone()
        url.pathname = withLocalePath(pathname, locale)
        return NextResponse.redirect(url)
    }

    if (!isPublicRoute(req)) {
        await auth.protect(
            isApi
                ? undefined
                : { unauthenticatedUrl: new URL(`/${pathLocale}/sign-in`, req.url).toString() }
        )
    }

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set(
        LOCALE_HEADER,
        pathLocale ?? negotiateLocale(req.headers.get('accept-language'))
    )

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
