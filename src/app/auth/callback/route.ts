import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')
    const origin = requestUrl.origin

    console.log('Auth callback received:', {
        hasCode: !!code,
        error,
        error_description,
        url: request.url
    })

    // Handle OAuth errors from Google
    if (error) {
        console.error('OAuth error from provider:', error, error_description)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error)}`)
    }

    if (code) {
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
                        } catch (error) {
                            console.error('Error setting cookies:', error)
                        }
                    },
                },
            }
        )

        try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            console.log('Exchange result:', {
                hasSession: !!data?.session,
                hasUser: !!data?.user,
                error: exchangeError?.message
            })

            if (exchangeError) {
                console.error('Auth callback exchange error:', exchangeError)
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
            }

            // Get user after session is established
            const { data: { user } } = await supabase.auth.getUser()

            console.log('User after exchange:', {
                hasUser: !!user,
                email: user?.email,
                onboardingComplete: user?.user_metadata?.onboardingComplete
            })

            if (user) {
                const onboardingComplete = user.user_metadata?.onboardingComplete

                if (onboardingComplete) {
                    return NextResponse.redirect(`${origin}/dashboard`)
                } else {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }
        } catch (err) {
            console.error('Unexpected error in auth callback:', err)
            return NextResponse.redirect(`${origin}/login?error=unexpected_error`)
        }
    }

    console.log('No code received, redirecting to login')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
}
