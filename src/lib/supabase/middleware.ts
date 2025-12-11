import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Check if Supabase env vars are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        // Skip auth check if Supabase not configured
        console.warn('Supabase env vars not configured, skipping auth middleware')
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Public paths - never redirect these
    const publicPaths = ['/', '/login', '/signup', '/auth/callback', '/privacy', '/terms', '/api']
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith('/api') || pathname.startsWith('/auth')
    )

    // If it's a public path, let it through
    if (isPublicPath) {
        // But if user is logged in and on login page, redirect to dashboard
        if (user && pathname === '/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    // Protected routes - require login
    const protectedPaths = ['/dashboard', '/onboarding']
    const isProtectedPath = protectedPaths.some(path =>
        pathname.startsWith(path)
    )

    if (!user && isProtectedPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isProtectedPath && !pathname.startsWith('/onboarding')) {
        const onboardingComplete = user.user_metadata?.onboardingComplete
        if (!onboardingComplete) {
            const url = request.nextUrl.clone()
            url.pathname = '/onboarding'
            return NextResponse.redirect(url)
        }
    }

    // If logged in but not onboarded, redirect to onboarding (except if already there)
    // This will be checked after we have user preferences in DB

    return supabaseResponse
}
