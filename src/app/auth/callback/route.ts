import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        // Check if user has completed onboarding
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const onboardingComplete = user.user_metadata?.onboardingComplete

            if (onboardingComplete) {
                // User already completed onboarding, go to dashboard
                return NextResponse.redirect(`${origin}/dashboard`)
            } else {
                // New user or hasn't completed onboarding
                return NextResponse.redirect(`${origin}/onboarding`)
            }
        }
    }

    // No code or something went wrong, go to login
    return NextResponse.redirect(`${origin}/login`)
}
