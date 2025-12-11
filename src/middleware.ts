import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Temporarily disabled to fix redirect loop
    // Just pass through all requests
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
