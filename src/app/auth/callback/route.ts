import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

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
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        // Get user after session is established
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const onboardingComplete = user.user_metadata?.onboardingComplete

            if (onboardingComplete) {
                return NextResponse.redirect(`${origin}/dashboard`)
            } else {
                return NextResponse.redirect(`${origin}/onboarding`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/login`)
}
