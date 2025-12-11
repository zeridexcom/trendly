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

    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // ONLY redirect for /dashboard routes if not logged in
    if (pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ONLY redirect for /onboarding routes if not logged in
    if (pathname.startsWith('/onboarding') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check onboarding status for dashboard (but not onboarding page itself)
    if (user && pathname.startsWith('/dashboard')) {
        const onboardingComplete = user.user_metadata?.onboardingComplete
        if (!onboardingComplete) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    return supabaseResponse
}
