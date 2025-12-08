import { NextRequest, NextResponse } from 'next/server'
import { getTrendingVideos, searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'
import { generateContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

// Industry to search queries mapping - what to search for each niche
const INDUSTRY_SEARCH_QUERIES: Record<string, string[]> = {
    'TECH': ['tech news today', 'AI tutorial 2024', 'gadget review', 'programming tips', 'tech tips', 'software review', 'coding tutorial'],
    'HEALTH': ['health tips', 'fitness tips', 'nutrition guide', 'wellness advice', 'healthy lifestyle', 'doctor explains', 'health news'],
    'FITNESS': ['workout routine', 'gym workout', 'home exercise', 'fitness motivation', 'yoga routine', 'bodybuilding', 'weight loss'],
    'BEAUTY': ['makeup tutorial', 'skincare routine', 'beauty tips', 'grwm', 'fashion haul', 'hair tutorial', 'beauty review'],
    'FOOD': ['cooking recipe', 'food review', 'Indian recipe', 'healthy meal', 'quick recipe', 'food vlog', 'restaurant review'],
    'TRAVEL': ['travel vlog', 'places to visit', 'travel tips', 'adventure vlog', 'trip vlog', 'travel guide', 'tourist places'],
    'GAMING': ['gaming India', 'BGMI gameplay', 'GTA 6', 'gaming setup', 'esports', 'game review', 'gaming tips'],
    'ENTERTAINMENT': ['bollywood news', 'movie review', 'entertainment news', 'celebrity interview', 'music video', 'trending video', 'viral'],
    'EDUCATION': ['study tips', 'exam preparation', 'online course', 'tutorial', 'learn', 'educational', 'how to'],
    'FINANCE': ['stock market', 'investing tips', 'personal finance', 'crypto', 'money tips', 'business ideas', 'trading'],
}

const MIN_VIEWS = 50000 // Minimum 50K views

// Generate detailed AI analysis for a video
async function generateDetailedVideoAnalysis(video: { title: string; channelTitle: string; viewCount: number; description: string; tags: string[] }, userIndustry: string): Promise<{
    whyPopular: string
    hook: string
    suggestedHashtags: string[]
    suggestedTags: string[]
    suggestedTitle: string
    suggestedDescription: string
    contentIdea: string
    keyTakeaways: string[]
}> {
    try {
        const prompt = `You are a viral content strategist. Analyze this trending ${userIndustry.toLowerCase()} video:

Title: "${video.title}"
Channel: ${video.channelTitle}
Views: ${video.viewCount.toLocaleString()}
Description: ${video.description.slice(0, 500)}
Tags: ${video.tags.slice(0, 10).join(', ')}

Provide a detailed JSON analysis to help a ${userIndustry.toLowerCase()} content creator replicate this success:
{
    "whyPopular": "2-3 sentence explanation of why this video went viral - what hook, timing, or trend made it successful",
    "hook": "The opening hook strategy used (first 3 seconds) that captures attention",
    "suggestedHashtags": ["5-7 trending hashtags for similar content"],
    "suggestedTags": ["8-10 SEO tags to use for similar content"],
    "suggestedTitle": "A catchy title idea inspired by this video for the creator's own content",
    "suggestedDescription": "A 2-3 line suggested description for similar content",
    "contentIdea": "Specific content idea the creator can make inspired by this video",
    "keyTakeaways": ["3-4 key lessons from this video's success"]
}`

        const response = await generateContent(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (err) {
        console.error('AI analysis error:', err)
    }

    return {
        whyPopular: 'This video leverages trending topics and engaging presentation style.',
        hook: 'Strong visual hook in the first 3 seconds grabs attention.',
        suggestedHashtags: ['#trending', '#viral', `#${userIndustry.toLowerCase()}`],
        suggestedTags: ['trending', 'viral', userIndustry.toLowerCase()],
        suggestedTitle: `Your Take on: ${video.title.slice(0, 30)}...`,
        suggestedDescription: 'Create engaging content inspired by trending topics.',
        contentIdea: `Create your own version of "${video.title.slice(0, 30)}..."`,
        keyTakeaways: ['Study the hook', 'Use trending topics', 'Engage with comments']
    }
}

// GET /api/youtube/trending - Get 30 personalized trending videos (50K+ views, last 3 days)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        let regionCode = searchParams.get('region') || 'IN'
        const maxResults = parseInt(searchParams.get('limit') || '30') // Default 30 videos
        const videoId = searchParams.get('videoId') // For getting detailed analysis of specific video

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

        // If requesting specific video analysis
        if (videoId && userIndustry) {
            // This would be a separate endpoint but for simplicity we handle it here
            // Just return a placeholder - the actual analysis is done client-side
        }

        let enhancedVideos: any[] = []
        let isPersonalized = false

        // Calculate date 3 days ago (72 hours)
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

        // If user has an industry, SEARCH for niche-specific videos
        if (userIndustry && INDUSTRY_SEARCH_QUERIES[userIndustry]) {
            const searchQueries = INDUSTRY_SEARCH_QUERIES[userIndustry]

            // Use ALL queries to get maximum variety
            const allSearchResults: any[] = []

            for (const query of searchQueries) {
                try {
                    const searchData = await searchVideos({
                        query: query,
                        maxResults: 15, // Get more per query
                        order: 'viewCount',
                        regionCode: regionCode,
                        publishedAfter: threeDaysAgo,
                    })

                    const videos = searchData.videos
                        .filter(video => video.viewCount >= MIN_VIEWS) // 50K+ views only
                        .map(video => ({
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

            // Sort by views (highest first)
            uniqueVideos.sort((a, b) => b.viewCount - a.viewCount)

            // Take required amount
            enhancedVideos = uniqueVideos.slice(0, maxResults)
            isPersonalized = enhancedVideos.length > 0
        }

        // Fallback to general trending if not enough personalized results
        if (enhancedVideos.length < 10) {
            const data = await getTrendingVideos(regionCode, undefined, 50)

            const fallbackVideos = data.videos
                .filter(video => video.viewCount >= MIN_VIEWS)
                .map(video => ({
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

            // Combine with personalized results
            const existingIds = new Set(enhancedVideos.map(v => v.id))
            const newFallback = fallbackVideos.filter(v => !existingIds.has(v.id))
            enhancedVideos = [...enhancedVideos, ...newFallback].slice(0, maxResults)
        }

        return NextResponse.json({
            success: true,
            data: {
                videos: enhancedVideos,
                totalResults: enhancedVideos.length,
                region: regionCode,
                freshness: 'Last 3 days',
                minViews: '50K+',
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

// POST /api/youtube/trending - Get detailed AI analysis for a specific video
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { video, userIndustry } = body

        if (!video) {
            return NextResponse.json(
                { success: false, error: 'Video data is required' },
                { status: 400 }
            )
        }

        const industry = userIndustry || 'GENERAL'

        // Generate detailed AI analysis
        const analysis = await generateDetailedVideoAnalysis(video, industry)

        return NextResponse.json({
            success: true,
            analysis,
            fetchedAt: new Date().toISOString(),
        })
    } catch (error: any) {
        console.error('Video Analysis Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze video' },
            { status: 500 }
        )
    }
}
