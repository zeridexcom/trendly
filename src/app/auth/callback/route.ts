import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        await supabase.auth.exchangeCodeForSession(code)

        // Check if user has completed onboarding
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // For new users via OAuth, redirect to onboarding
            // We'll check onboardingComplete in middleware later
            return NextResponse.redirect(`${origin}/onboarding`)
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/dashboard`)
}
