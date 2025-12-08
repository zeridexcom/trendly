import { NextRequest, NextResponse } from 'next/server'
import { getTrendingVideos, searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'
import { generateContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

// Industry to search queries mapping - what to search for each niche
const INDUSTRY_SEARCH_QUERIES: Record<string, string[]> = {
    'TECH': ['tech news 2024', 'AI tutorial', 'gadget review', 'programming tips', 'startup India'],
    'HEALTH': ['health tips', 'workout routine', 'nutrition guide', 'medical advice', 'wellness tips'],
    'FITNESS': ['fitness workout', 'gym motivation', 'home workout', 'bodybuilding tips', 'yoga routine'],
    'BEAUTY': ['makeup tutorial', 'skincare routine', 'beauty tips', 'hair care', 'fashion haul'],
    'FOOD': ['cooking recipe', 'food review', 'Indian recipe', 'street food', 'healthy meal prep'],
    'TRAVEL': ['travel vlog India', 'tourist places', 'travel tips', 'budget travel', 'adventure travel'],
    'GAMING': ['gaming India', 'BGMI gameplay', 'GTA 6 news', 'gaming setup', 'esports India'],
    'ENTERTAINMENT': ['bollywood news', 'movie review', 'entertainment news', 'celebrity interview', 'music trending'],
    'EDUCATION': ['study tips', 'exam preparation', 'online course', 'learning tutorial', 'educational content'],
    'FINANCE': ['stock market India', 'investing tips', 'personal finance', 'crypto news', 'business ideas'],
}

// GET /api/youtube/trending - Get personalized trending videos
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        let regionCode = searchParams.get('region') || 'IN'
        const categoryId = searchParams.get('category') || undefined
        const maxResults = parseInt(searchParams.get('limit') || '20')

        // Get user preferences from Supabase
        let userIndustry: string | null = null
        try {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.user_metadata) {
                regionCode = user.user_metadata.location || regionCode
                userIndustry = user.user_metadata.industry || null
            }
        } catch {
            // Not authenticated, use query params
        }

        let enhancedVideos: any[] = []
        let isPersonalized = false

        // If user has an industry, SEARCH for niche-specific videos instead of filtering general trending
        if (userIndustry && INDUSTRY_SEARCH_QUERIES[userIndustry]) {
            const searchQueries = INDUSTRY_SEARCH_QUERIES[userIndustry]
            // Pick 2-3 random queries to get variety
            const selectedQueries = searchQueries.sort(() => Math.random() - 0.5).slice(0, 2)

            // Search for each query and combine results
            const allSearchResults: any[] = []

            for (const query of selectedQueries) {
                try {
                    const searchData = await searchVideos({
                        query: query,
                        maxResults: 10,
                        order: 'viewCount',
                        regionCode: regionCode,
                        publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
                    })

                    const videos = searchData.videos.map(video => ({
                        ...video,
                        engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
                        formattedViews: formatViewCount(video.viewCount),
                        formattedLikes: formatViewCount(video.likeCount),
                        formattedComments: formatViewCount(video.commentCount),
                        formattedDuration: parseDuration(video.duration),
                        categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
                        matchesNiche: true, // All search results match by definition
                        searchQuery: query,
                    }))

                    allSearchResults.push(...videos)
                } catch (err) {
                    console.error(`Search error for query "${query}":`, err)
                }
            }

            // Deduplicate by video ID and sort by views
            const uniqueVideos = Array.from(
                new Map(allSearchResults.map(v => [v.id, v])).values()
            ).sort((a, b) => b.viewCount - a.viewCount)

            enhancedVideos = uniqueVideos.slice(0, maxResults)
            isPersonalized = enhancedVideos.length > 0
        }

        // Fallback to general trending only if no personalized results
        if (enhancedVideos.length === 0) {
            const data = await getTrendingVideos(regionCode, categoryId, maxResults)

            enhancedVideos = data.videos.map(video => ({
                ...video,
                engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
                formattedViews: formatViewCount(video.viewCount),
                formattedLikes: formatViewCount(video.likeCount),
                formattedComments: formatViewCount(video.commentCount),
                formattedDuration: parseDuration(video.duration),
                categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
                matchesNiche: false,
            }))
        }

        return NextResponse.json({
            success: true,
            data: {
                videos: enhancedVideos,
                totalResults: enhancedVideos.length,
                region: regionCode,
                fetchedAt: new Date().toISOString(),
                personalization: {
                    industry: userIndustry,
                    isPersonalized: isPersonalized,
                    matchingVideos: enhancedVideos.filter((v: any) => v.matchesNiche).length,
                }
            }
        })
    } catch (error: any) {
        console.error('YouTube Trending Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch trending videos' },
            { status: 500 }
        )
    }
}

// POST /api/youtube/trending - Search and analyze with AI
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { query, niche, analyzeWithAI = true } = body

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Search query is required' },
                { status: 400 }
            )
        }

        // Search YouTube
        const searchData = await searchVideos({
            query,
            maxResults: 15,
            order: 'viewCount',
            regionCode: 'IN',
        })

        // Enhance videos with metrics
        const enhancedVideos = searchData.videos.map(video => ({
            ...video,
            engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
            formattedViews: formatViewCount(video.viewCount),
            formattedLikes: formatViewCount(video.likeCount),
            formattedComments: formatViewCount(video.commentCount),
            formattedDuration: parseDuration(video.duration),
            categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
        }))

        let aiAnalysis = null

        // AI Analysis if requested
        if (analyzeWithAI && enhancedVideos.length > 0) {
            const topVideos = enhancedVideos.slice(0, 5)
            const videoSummary = topVideos.map((v, i) =>
                `${i + 1}. "${v.title}" by ${v.channelTitle} - ${v.formattedViews} views, ${v.engagementRate} engagement, Tags: ${v.tags.slice(0, 5).join(', ')}`
            ).join('\n')

            const aiPrompt = `You are a digital marketing expert and content strategist. Analyze these trending YouTube videos for the query "${query}"${niche ? ` in the ${niche} niche` : ''}:

${videoSummary}

Provide analysis in this JSON format:
{
    "whyTrending": "Brief explanation of why these videos are performing well",
    "commonPatterns": ["pattern1", "pattern2", "pattern3"],
    "recommendedTopics": ["topic1", "topic2", "topic3"],
    "contentIdeas": [
        {"title": "Video idea 1", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"},
        {"title": "Video idea 2", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"},
        {"title": "Video idea 3", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"}
    ],
    "bestHashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
    "optimalLength": "Recommended video length based on trends",
    "postingAdvice": "Best time and frequency to post"
}`

            try {
                const aiResponse = await generateContent(aiPrompt)
                // Parse JSON from response
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    aiAnalysis = JSON.parse(jsonMatch[0])
                }
            } catch (aiError) {
                console.error('AI Analysis Error:', aiError)
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                query,
                videos: enhancedVideos,
                totalResults: searchData.totalResults,
                aiAnalysis,
                fetchedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('YouTube Search Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to search videos' },
            { status: 500 }
        )
    }
}
