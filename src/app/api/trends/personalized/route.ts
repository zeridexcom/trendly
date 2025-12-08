import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends } from '@/lib/google-trends'
import { createClient } from '@/lib/supabase/server'
import { filterTrendsByRelevance } from '@/lib/ai'

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

        // Get all trends from Google
        const allTrends = await getDailyTrends(location)

        // If user has an industry, use AI to filter for 95%+ relevance
        let trends = allTrends
        let aiFiltered = false

        if (industry && industry !== 'ALL' && industry !== 'OTHER') {
            try {
                const aiResults = await filterTrendsByRelevance(allTrends, industry, 95)

                if (aiResults.length > 0) {
                    // Transform AI results to include content ideas
                    trends = aiResults.map(r => ({
                        title: r.title,
                        traffic: allTrends.find(t => t.title === r.title)?.traffic || '0',
                        relatedQueries: allTrends.find(t => t.title === r.title)?.relatedQueries || [],
                        industry: industry,
                        relevanceScore: r.relevanceScore,
                        reason: r.reason,
                        contentIdea: r.contentIdea,
                        formattedTraffic: allTrends.find(t => t.title === r.title)?.traffic || 'Trending',
                    }))
                    aiFiltered = true
                } else {
                    // No 95%+ matches - show message instead of wrong trends
                    trends = []
                }
            } catch (error) {
                console.error('AI filtering failed, returning empty for accuracy:', error)
                trends = [] // Better to show nothing than wrong data
            }
        }

        return NextResponse.json({
            success: true,
            trends,
            personalization: {
                location,
                industry: industry || 'ALL',
                aiFiltered,
                message: trends.length === 0 && industry
                    ? `No 95%+ relevant trends found for ${industry} right now. Check back later!`
                    : null
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
