import { NextRequest, NextResponse } from 'next/server'
import { getPersonalizedTrends, getDailyTrends } from '@/lib/google-trends'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Allow override via query params (for unauthenticated users)
        let location = searchParams.get('geo') || 'IN'
        let industry = searchParams.get('industry') || null

        // Try to get user preferences if authenticated
        try {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.user_metadata) {
                // Use user's saved preferences
                location = user.user_metadata.location || location
                industry = user.user_metadata.industry || industry
            }
        } catch {
            // Not authenticated, use query params
        }

        // Get personalized trends
        let trends
        if (industry) {
            trends = await getPersonalizedTrends(location, industry)
        } else {
            trends = await getDailyTrends(location)
        }

        return NextResponse.json({
            success: true,
            trends,
            personalization: {
                location,
                industry: industry || 'ALL',
            }
        })
    } catch (error) {
        console.error('Personalized trends error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trends' },
            { status: 500 }
        )
    }
}
