import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { industry, location, platforms, frequency } = body

        // Store preferences in user metadata
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                industry,
                location,
                platforms,
                frequency,
                onboardingComplete: true,
            }
        })

        if (updateError) {
            console.error('Error updating user preferences:', updateError)
            return NextResponse.json(
                { error: 'Failed to save preferences' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            preferences: { industry, location, platforms, frequency }
        })
    } catch (error) {
        console.error('Preferences API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get preferences from user metadata
        const preferences = {
            industry: user.user_metadata?.industry || null,
            location: user.user_metadata?.location || 'IN',
            platforms: user.user_metadata?.platforms || [],
            frequency: user.user_metadata?.frequency || null,
            onboardingComplete: user.user_metadata?.onboardingComplete || false,
        }

        return NextResponse.json(preferences)
    } catch (error) {
        console.error('Preferences GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
