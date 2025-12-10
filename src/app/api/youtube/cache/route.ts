import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// Niches mapping
const NICHE_KEYWORDS: Record<string, string[]> = {
    TECH: ['technology', 'tech', 'gadgets', 'AI', 'programming', 'coding', 'software', 'apps', 'smartphone', 'laptop'],
    HEALTH: ['health', 'fitness', 'wellness', 'nutrition', 'workout', 'diet', 'mental health', 'yoga', 'gym'],
    GAMING: ['gaming', 'games', 'esports', 'playstation', 'xbox', 'pc gaming', 'mobile games', 'streamer'],
    ENTERTAINMENT: ['movies', 'tv shows', 'celebrities', 'music', 'comedy', 'drama', 'netflix', 'bollywood'],
    BUSINESS: ['business', 'startup', 'entrepreneur', 'investing', 'finance', 'money', 'stocks', 'marketing'],
    FASHION: ['fashion', 'style', 'clothing', 'beauty', 'makeup', 'skincare', 'trends', 'outfits'],
    FOOD: ['food', 'cooking', 'recipes', 'restaurant', 'chef', 'cuisine', 'baking', 'street food'],
    EDUCATION: ['education', 'learning', 'tutorial', 'how to', 'study', 'course', 'exam', 'university'],
    TRAVEL: ['travel', 'tourism', 'vacation', 'places', 'adventure', 'destination', 'vlog', 'explore'],
    FITNESS: ['fitness', 'gym', 'workout', 'exercise', 'bodybuilding', 'weight loss', 'training'],
    FINANCE: ['finance', 'investing', 'stocks', 'crypto', 'money', 'trading', 'wealth', 'budget'],
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const niche = (searchParams.get('niche') || 'TECH').toUpperCase()
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '30')
        const country = searchParams.get('country') || 'IN'

        const offset = (page - 1) * limit
        const supabase = getSupabaseAdmin()

        // Get videos from cache
        const { data: videos, error } = await supabase
            .from('youtube_video_cache')
            .select('*')
            .eq('niche', niche)
            .eq('country', country)
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('view_count', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching videos:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        // Get total count
        const { count } = await supabase
            .from('youtube_video_cache')
            .select('*', { count: 'exact', head: true })
            .eq('niche', niche)
            .eq('country', country)
            .eq('is_active', true)

        const totalVideos = count || 0
        const totalPages = Math.ceil(totalVideos / limit)
        const hasMore = page < totalPages

        // Format videos for frontend
        const formattedVideos = (videos || []).map(v => ({
            id: v.video_id,
            title: v.title,
            description: v.description,
            thumbnail: v.thumbnail,
            channelTitle: v.channel_title,
            channelId: v.channel_id,
            publishedAt: v.published_at,
            viewCount: v.view_count?.toString(),
            likeCount: v.like_count?.toString(),
            commentCount: v.comment_count?.toString(),
            formattedViews: formatViews(v.view_count),
            formattedLikes: formatViews(v.like_count),
            duration: v.duration,
            tags: v.tags,
            // AI insights
            aiInsight: v.ai_insight,
            contentIdea: v.content_idea,
            viralScore: v.viral_score
        }))

        return NextResponse.json({
            success: true,
            videos: formattedVideos,
            pagination: {
                page,
                limit,
                totalVideos,
                totalPages,
                hasMore
            },
            niche,
            country
        })

    } catch (error: any) {
        console.error('YouTube cache API error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// Format view counts
function formatViews(count: number | null): string {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
}
