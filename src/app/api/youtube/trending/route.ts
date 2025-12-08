import { NextRequest, NextResponse } from 'next/server'
import { getTrendingVideos, searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'
import { generateContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

// Industry to search queries mapping - what to search for each niche
const INDUSTRY_SEARCH_QUERIES: Record<string, string[]> = {
    'TECH': ['tech news today', 'AI news 2024', 'gadget review new', 'programming tutorial', 'tech tips'],
    'HEALTH': ['health tips today', 'fitness routine', 'nutrition tips', 'wellness advice', 'healthy lifestyle'],
    'FITNESS': ['workout today', 'gym workout', 'home exercise', 'fitness motivation', 'yoga today'],
    'BEAUTY': ['makeup tutorial new', 'skincare routine 2024', 'beauty tips', 'grwm today', 'fashion haul'],
    'FOOD': ['recipe today', 'cooking new', 'food review', 'healthy meal', 'quick recipe'],
    'TRAVEL': ['travel vlog new', 'places to visit', 'travel tips', 'adventure vlog', 'trip vlog'],
    'GAMING': ['gaming new', 'gameplay today', 'game review new', 'gaming tips', 'esports'],
    'ENTERTAINMENT': ['entertainment news today', 'movie review new', 'celebrity news', 'trending video', 'viral today'],
    'EDUCATION': ['learn today', 'tutorial new', 'study tips', 'education video', 'how to'],
    'FINANCE': ['stock market today', 'investing tips new', 'finance news', 'money tips', 'crypto today'],
}

// Generate AI summary for a video
async function generateVideoInsight(video: { title: string; channelTitle: string; viewCount: number; description: string }, userIndustry: string): Promise<{ whyPopular: string; keyTakeaway: string; contentIdea: string }> {
    try {
        const prompt = `You are a content strategist. A ${userIndustry.toLowerCase()} creator is analyzing this trending video:

Title: "${video.title}"
Channel: ${video.channelTitle}
Views: ${video.viewCount.toLocaleString()}
Description: ${video.description.slice(0, 300)}

Provide a brief JSON analysis (be concise, max 1-2 sentences each):
{
    "whyPopular": "Why this video is performing well (hook, topic, timing)",
    "keyTakeaway": "What the creator can learn from this video's success",
    "contentIdea": "A specific content idea inspired by this for a ${userIndustry.toLowerCase()} creator"
}`

        const response = await generateContent(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (err) {
        console.error('AI insight error:', err)
    }

    return {
        whyPopular: 'Trending topic with high engagement',
        keyTakeaway: 'Study the hook and thumbnail style',
        contentIdea: `Create your own take on "${video.title.slice(0, 30)}..."`
    }
}

// GET /api/youtube/trending - Get personalized trending videos (FRESH, last 3 days)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        let regionCode = searchParams.get('region') || 'IN'
        const categoryId = searchParams.get('category') || undefined
        const maxResults = parseInt(searchParams.get('limit') || '6')
        const includeAI = searchParams.get('ai') !== 'false' // Default to true

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

        // Calculate date 3 days ago (72 hours)
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

        // If user has an industry, SEARCH for niche-specific videos
        if (userIndustry && INDUSTRY_SEARCH_QUERIES[userIndustry]) {
            const searchQueries = INDUSTRY_SEARCH_QUERIES[userIndustry]
            // Pick 3 queries to get variety
            const selectedQueries = searchQueries.sort(() => Math.random() - 0.5).slice(0, 3)

            // Search for each query and combine results
            const allSearchResults: any[] = []

            for (const query of selectedQueries) {
                try {
                    const searchData = await searchVideos({
                        query: query,
                        maxResults: 8,
                        order: 'viewCount', // Sort by most viewed
                        regionCode: regionCode,
                        publishedAfter: threeDaysAgo, // ONLY LAST 3 DAYS!
                    })

                    const videos = searchData.videos.map(video => ({
                        ...video,
                        engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
                        formattedViews: formatViewCount(video.viewCount),
                        formattedLikes: formatViewCount(video.likeCount),
                        formattedComments: formatViewCount(video.commentCount),
                        formattedDuration: parseDuration(video.duration),
                        categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
                        matchesNiche: true,
                        searchQuery: query,
                        daysAgo: Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)),
                    }))

                    allSearchResults.push(...videos)
                } catch (err) {
                    console.error(`Search error for query "${query}":`, err)
                }
            }

            // Deduplicate by video ID
            const uniqueVideos = Array.from(
                new Map(allSearchResults.map(v => [v.id, v])).values()
            )

            // Sort by views (highest first) - most viral videos at top
            uniqueVideos.sort((a, b) => b.viewCount - a.viewCount)

            // Take top videos
            enhancedVideos = uniqueVideos.slice(0, maxResults)
            isPersonalized = enhancedVideos.length > 0

            // Add AI insights for top 3 videos only (to save API calls)
            if (includeAI && userIndustry && enhancedVideos.length > 0) {
                const topVideosForAI = enhancedVideos.slice(0, 3)
                const aiInsights = await Promise.all(
                    topVideosForAI.map(video => generateVideoInsight(video, userIndustry!))
                )

                // Attach insights to videos
                for (let i = 0; i < topVideosForAI.length; i++) {
                    enhancedVideos[i].aiInsight = aiInsights[i]
                }
            }
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
                daysAgo: Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)),
            }))
        }

        return NextResponse.json({
            success: true,
            data: {
                videos: enhancedVideos,
                totalResults: enhancedVideos.length,
                region: regionCode,
                freshness: 'Last 3 days',
                fetchedAt: new Date().toISOString(),
                personalization: {
                    industry: userIndustry,
                    isPersonalized: isPersonalized,
                    matchingVideos: enhancedVideos.filter((v: any) => v.matchesNiche).length,
                    hasAIInsights: enhancedVideos.some((v: any) => v.aiInsight),
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

        // Search YouTube - only last 3 days
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

        const searchData = await searchVideos({
            query,
            maxResults: 15,
            order: 'viewCount',
            regionCode: 'IN',
            publishedAfter: threeDaysAgo,
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
            daysAgo: Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)),
        }))

        let aiAnalysis = null

        // AI Analysis if requested
        if (analyzeWithAI && enhancedVideos.length > 0) {
            const topVideos = enhancedVideos.slice(0, 5)
            const videoSummary = topVideos.map((v, i) =>
                `${i + 1}. "${v.title}" by ${v.channelTitle} - ${v.formattedViews} views, ${v.engagementRate} engagement, Posted ${v.daysAgo} days ago`
            ).join('\n')

            const aiPrompt = `You are a digital marketing expert. Analyze these FRESH trending YouTube videos (posted in last 3 days) for the query "${query}"${niche ? ` in the ${niche} niche` : ''}:

${videoSummary}

Provide analysis in this JSON format:
{
    "whyTrending": "Brief explanation of why these videos are performing well RIGHT NOW",
    "commonPatterns": ["pattern1", "pattern2", "pattern3"],
    "recommendedTopics": ["topic1", "topic2", "topic3"],
    "contentIdeas": [
        {"title": "Video idea 1", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"},
        {"title": "Video idea 2", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"},
        {"title": "Video idea 3", "hook": "Opening hook", "format": "Tutorial/Vlog/etc"}
    ],
    "bestHashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
    "optimalLength": "Recommended video length based on trends",
    "postingAdvice": "Best time to post to ride this trend"
}`

            try {
                const aiResponse = await generateContent(aiPrompt)
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
                freshness: 'Last 3 days',
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
