import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Get Supabase admin client for reading cache
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// GET /api/youtube/trending - Get cached trending videos (NO API CALLS)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const maxResults = parseInt(searchParams.get('limit') || '30')

        // Get user preferences from Supabase
        let userIndustry: string | null = null
        try {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.user_metadata) {
                userIndustry = user.user_metadata.industry || null
            }
        } catch {
            // Not authenticated
        }

        // ============ READ FROM SUPABASE CACHE (NO YOUTUBE API CALLS) ============
        const supabaseAdmin = getSupabaseAdmin()

        let query = supabaseAdmin
            .from('cached_youtube_videos')
            .select('*')
            .order('view_count', { ascending: false })
            .limit(maxResults)

        // If user has an industry, filter by it
        if (userIndustry && userIndustry !== 'ALL' && userIndustry !== 'OTHER') {
            query = query.eq('industry', userIndustry)
        }

        const { data: cachedVideos, error } = await query

        if (error) {
            console.error('Cache read error:', error)
            return NextResponse.json({
                success: false,
                error: 'Failed to load videos. Please try again.',
            }, { status: 500 })
        }

        // Transform to expected format
        const videos = (cachedVideos || []).map((v: any) => ({
            id: v.id,
            title: v.title,
            description: v.description || '',
            thumbnail: v.thumbnail,
            channelTitle: v.channel_title,
            publishedAt: v.published_at,
            viewCount: v.view_count,
            likeCount: v.like_count,
            commentCount: v.comment_count,
            formattedViews: v.formatted_views,
            formattedLikes: v.formatted_likes,
            formattedComments: v.formatted_comments,
            formattedDuration: v.formatted_duration || '0:00',
            engagementRate: v.engagement_rate,
            categoryName: v.category_name || 'Unknown',
            tags: v.tags || [],
            url: v.url || `https://www.youtube.com/watch?v=${v.id}`,
            daysAgo: v.days_ago,
            industry: v.industry,
        }))

        // Get cache metadata
        const { data: metadata } = await supabaseAdmin
            .from('cache_metadata')
            .select('last_youtube_refresh, youtube_videos_count')
            .eq('id', 'main')
            .single()

        return NextResponse.json({
            success: true,
            data: {
                videos,
                fetchedAt: metadata?.last_youtube_refresh || new Date().toISOString(),
                totalCached: metadata?.youtube_videos_count || videos.length,
                fromCache: true,
            },
            personalization: {
                industry: userIndustry,
                isPersonalized: !!userIndustry,
                matchingVideos: videos.length,
            }
        })
    } catch (error: any) {
        console.error('YouTube trending error:', error)
        return NextResponse.json({
            success: false,
            error: 'Videos temporarily unavailable. Cache may need refresh.',
        }, { status: 500 })
    }
}

// POST /api/youtube/trending - This was used for search, now disabled to save API calls
export async function POST(req: NextRequest) {
    return NextResponse.json({
        success: false,
        error: 'Search feature temporarily disabled. Use cached trending videos instead.',
        message: 'To save API quota, search is only run during daily cache refresh.'
    }, { status: 400 })
}
