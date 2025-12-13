import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')
    const origin = requestUrl.origin

    console.log('=== Auth Callback Start ===')
    console.log('URL:', request.url)
    console.log('Code present:', !!code)
    console.log('Error:', error, error_description)

    // Handle OAuth errors from Google
    if (error) {
        console.error('OAuth error from provider:', error, error_description)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error)}`)
    }

    if (!code) {
        console.error('No code received in callback')
        return NextResponse.redirect(`${origin}/login?error=no_code`)
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch (err) {
                        console.error('Error setting cookies:', err)
                    }
                },
            },
        }
    )

    try {
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        console.log('Exchange result:', {
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            userId: data?.user?.id,
            email: data?.user?.email,
            error: exchangeError?.message
        })

        if (exchangeError) {
            console.error('Exchange error:', exchangeError)
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
        }

        // Use user from exchange data directly (more reliable)
        const user = data?.user

        if (!user) {
            console.error('No user in exchange data')
            return NextResponse.redirect(`${origin}/login?error=no_user`)
        }

        const onboardingComplete = user.user_metadata?.onboardingComplete
        console.log('Onboarding complete:', onboardingComplete)

        if (onboardingComplete) {
            console.log('Redirecting to dashboard')
            return NextResponse.redirect(`${origin}/dashboard`)
        } else {
            console.log('Redirecting to onboarding')
            return NextResponse.redirect(`${origin}/onboarding`)
        }

    } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        return NextResponse.redirect(`${origin}/login?error=unexpected_error`)
    }
}
