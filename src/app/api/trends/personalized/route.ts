import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends } from '@/lib/google-trends'
import { createClient } from '@/lib/supabase/server'
import { filterTrendsByRelevance, generateNicheTrends } from '@/lib/ai'

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
        let trends: any[] = allTrends
        let aiFiltered = false
        let aiGenerated = false

        if (industry && industry !== 'ALL' && industry !== 'OTHER') {
            try {
                // Step 1: Try to filter existing trends for 95%+ relevance
                const aiResults = await filterTrendsByRelevance(allTrends, industry, 95)

                if (aiResults.length >= 3) {
                    // Found enough relevant trends in Google Trends
                    trends = aiResults.map(r => ({
                        title: r.title,
                        traffic: allTrends.find(t => t.title === r.title)?.traffic || '0',
                        relatedQueries: allTrends.find(t => t.title === r.title)?.relatedQueries || [],
                        industry: industry,
                        relevanceScore: r.relevanceScore,
                        reason: r.reason,
                        contentIdea: r.contentIdea,
                        formattedTraffic: allTrends.find(t => t.title === r.title)?.traffic || 'Trending',
                        source: 'Google Trends',
                    }))
                    aiFiltered = true
                } else {
                    // Step 2: Not enough matches - use AI to find/generate real niche trends
                    console.log(`Only ${aiResults.length} matches found, generating niche trends...`)
                    const generatedTrends = await generateNicheTrends(industry, 5)

                    if (generatedTrends.length > 0) {
                        // Combine any found + generated to ensure minimum 5
                        const foundTrends = aiResults.map(r => ({
                            title: r.title,
                            traffic: allTrends.find(t => t.title === r.title)?.traffic || 'Trending',
                            industry: industry,
                            relevanceScore: r.relevanceScore,
                            reason: r.reason,
                            contentIdea: r.contentIdea,
                            formattedTraffic: 'Live Trending',
                            source: 'Google Trends',
                        }))

                        const aiTrends = generatedTrends.map(t => ({
                            title: t.title,
                            traffic: 'Hot Topic',
                            industry: industry,
                            relevanceScore: t.relevanceScore,
                            reason: t.reason,
                            contentIdea: t.contentIdea,
                            formattedTraffic: 'AI Discovered',
                            source: (t as any).source || 'AI Discovered',
                        }))

                        // Prioritize live trends, then AI discovered
                        trends = [...foundTrends, ...aiTrends].slice(0, 8)
                        aiFiltered = foundTrends.length > 0
                        aiGenerated = aiTrends.length > 0
                    } else {
                        // AI generation also failed - return what we found
                        trends = aiResults.map(r => ({
                            title: r.title,
                            relevanceScore: r.relevanceScore,
                            reason: r.reason,
                            contentIdea: r.contentIdea,
                            formattedTraffic: 'Trending',
                        }))
                    }
                }
            } catch (error) {
                console.error('AI filtering failed:', error)
                // Fallback to AI generation only
                try {
                    const generatedTrends = await generateNicheTrends(industry, 5)
                    trends = generatedTrends.map(t => ({
                        title: t.title,
                        relevanceScore: t.relevanceScore,
                        reason: t.reason,
                        contentIdea: t.contentIdea,
                        formattedTraffic: 'AI Discovered',
                        source: (t as any).source || 'AI Discovered',
                    }))
                    aiGenerated = true
                } catch {
                    trends = []
                }
            }
        }

        return NextResponse.json({
            success: true,
            trends,
            personalization: {
                location,
                industry: industry || 'ALL',
                aiFiltered,
                aiGenerated,
                message: trends.length === 0
                    ? `Unable to find trends for ${industry || 'your niche'}. Please try again later.`
                    : aiGenerated
                        ? `Showing AI-discovered ${(industry || 'niche').toLowerCase()} trends`
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
