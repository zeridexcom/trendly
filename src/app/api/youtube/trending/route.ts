import { NextRequest, NextResponse } from 'next/server'
import { getTrendingVideos, searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'
import { generateContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

// Industry to YouTube category mapping
const INDUSTRY_CATEGORY_MAP: Record<string, string[]> = {
    'TECH': ['28', '27', '24'], // Science & Technology, Education, Entertainment
    'HEALTH': ['27', '26', '22'], // Education, Howto & Style, People & Blogs
    'FITNESS': ['17', '26', '22'], // Sports, Howto & Style, People & Blogs
    'BEAUTY': ['26', '22', '24'], // Howto & Style, People & Blogs, Entertainment
    'FOOD': ['26', '22', '24'], // Howto & Style, People & Blogs, Entertainment
    'TRAVEL': ['19', '22', '24'], // Travel & Events, People & Blogs, Entertainment
    'GAMING': ['20', '24', '1'], // Gaming, Entertainment, Film & Animation
    'ENTERTAINMENT': ['24', '23', '10'], // Entertainment, Comedy, Music
    'EDUCATION': ['27', '28', '26'], // Education, Science & Technology, Howto & Style
    'FINANCE': ['27', '25', '22'], // Education, News & Politics, People & Blogs
}

// Industry keywords for relevance scoring
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
    'TECH': ['ai', 'artificial intelligence', 'tech', 'technology', 'software', 'programming', 'coding', 'developer', 'apple', 'google', 'microsoft', 'chatgpt', 'iphone', 'android', 'startup', 'saas', 'crypto', 'blockchain', 'gadget', 'review'],
    'HEALTH': ['health', 'wellness', 'medical', 'doctor', 'hospital', 'medicine', 'nutrition', 'mental health', 'anxiety', 'depression', 'therapy', 'cure', 'treatment', 'disease', 'symptoms', 'healthy'],
    'FITNESS': ['fitness', 'workout', 'gym', 'exercise', 'training', 'muscle', 'weight loss', 'diet', 'yoga', 'running', 'bodybuilding', 'cardio', 'strength', 'athlete', 'sports'],
    'BEAUTY': ['beauty', 'makeup', 'skincare', 'cosmetics', 'fashion', 'style', 'hair', 'tutorial', 'grwm', 'get ready with me', 'routine', 'aesthetic', 'glow up'],
    'FOOD': ['food', 'recipe', 'cooking', 'chef', 'restaurant', 'cuisine', 'baking', 'kitchen', 'meal prep', 'mukbang', 'eating', 'taste test', 'food review'],
    'TRAVEL': ['travel', 'vlog', 'trip', 'destination', 'vacation', 'tourism', 'explore', 'adventure', 'hotel', 'flight', 'backpacking', 'wanderlust'],
    'GAMING': ['gaming', 'game', 'gamer', 'playthrough', 'gameplay', 'esports', 'streamer', 'ps5', 'xbox', 'nintendo', 'pc gaming', 'mobile game', 'gta', 'fortnite'],
    'ENTERTAINMENT': ['entertainment', 'movie', 'film', 'celebrity', 'music', 'bollywood', 'hollywood', 'drama', 'comedy', 'viral', 'trending', 'reaction'],
    'EDUCATION': ['education', 'learn', 'tutorial', 'course', 'study', 'exam', 'college', 'university', 'student', 'teacher', 'lecture', 'how to', 'explained'],
    'FINANCE': ['finance', 'money', 'invest', 'stock', 'trading', 'crypto', 'wealth', 'budget', 'savings', 'income', 'business', 'entrepreneur', 'startup', 'economy'],
}

// Calculate relevance score for a video based on user's industry
function calculateRelevanceScore(video: { title: string; description: string; tags: string[]; categoryId: string }, userIndustry: string): number {
    let score = 0
    const keywords = INDUSTRY_KEYWORDS[userIndustry] || []
    const preferredCategories = INDUSTRY_CATEGORY_MAP[userIndustry] || []

    const titleLower = video.title.toLowerCase()
    const descLower = video.description.toLowerCase()
    const tagsLower = video.tags.map(t => t.toLowerCase())

    // Check title (highest weight)
    for (const keyword of keywords) {
        if (titleLower.includes(keyword)) {
            score += 30 // High score for title match
        }
    }

    // Check tags (medium weight)
    for (const keyword of keywords) {
        if (tagsLower.some(tag => tag.includes(keyword))) {
            score += 15
        }
    }

    // Check description (lower weight)
    for (const keyword of keywords) {
        if (descLower.includes(keyword)) {
            score += 5
        }
    }

    // Check category match
    if (preferredCategories.includes(video.categoryId)) {
        score += 20
    }

    return Math.min(score, 100) // Cap at 100
}

// GET /api/youtube/trending - Get real trending videos (personalized)
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

        // Fetch more videos to have a good pool for filtering
        const fetchCount = userIndustry ? maxResults * 3 : maxResults
        const data = await getTrendingVideos(regionCode, categoryId, Math.min(fetchCount, 50))

        // Enhance with calculated metrics
        let enhancedVideos = data.videos.map(video => ({
            ...video,
            engagementRate: calculateEngagementRate(video).toFixed(2) + '%',
            formattedViews: formatViewCount(video.viewCount),
            formattedLikes: formatViewCount(video.likeCount),
            formattedComments: formatViewCount(video.commentCount),
            formattedDuration: parseDuration(video.duration),
            categoryName: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
            relevanceScore: userIndustry ? calculateRelevanceScore(video, userIndustry) : 0,
            matchesNiche: false,
        }))

        // If user has industry preference, sort by relevance score
        if (userIndustry) {
            // Mark videos that match the niche
            enhancedVideos = enhancedVideos.map(video => ({
                ...video,
                matchesNiche: video.relevanceScore >= 20, // At least 20 score = relevant
            }))

            // Sort: highest relevance score first, then by view count
            enhancedVideos.sort((a, b) => {
                if (b.relevanceScore !== a.relevanceScore) {
                    return b.relevanceScore - a.relevanceScore
                }
                return b.viewCount - a.viewCount
            })
        }

        // Take only requested amount
        const finalVideos = enhancedVideos.slice(0, maxResults)

        return NextResponse.json({
            success: true,
            data: {
                videos: finalVideos,
                totalResults: data.totalResults,
                region: regionCode,
                fetchedAt: new Date().toISOString(),
                personalization: {
                    industry: userIndustry,
                    isPersonalized: !!userIndustry,
                    matchingVideos: finalVideos.filter(v => v.matchesNiche).length,
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
