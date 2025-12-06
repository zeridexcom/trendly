import { NextRequest, NextResponse } from 'next/server'
import { getTrendingVideos, searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'
import { generateContent } from '@/lib/ai'

// GET /api/youtube/trending - Get real trending videos
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const regionCode = searchParams.get('region') || 'IN'
        const categoryId = searchParams.get('category') || undefined
        const maxResults = parseInt(searchParams.get('limit') || '20')

        const data = await getTrendingVideos(regionCode, categoryId, maxResults)

        // Enhance with calculated metrics
        const enhancedVideos = data.videos.map(video => ({
            ...video,
            engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
            formattedViews: formatViewCount(video.viewCount),
            formattedLikes: formatViewCount(video.likeCount),
            formattedComments: formatViewCount(video.commentCount),
            formattedDuration: parseDuration(video.duration),
            categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
        }))

        return NextResponse.json({
            success: true,
            data: {
                videos: enhancedVideos,
                totalResults: data.totalResults,
                region: regionCode,
                fetchedAt: new Date().toISOString(),
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
