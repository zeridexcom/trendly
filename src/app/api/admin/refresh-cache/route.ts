import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getDailyTrends } from '@/lib/google-trends'
import { searchVideos, calculateEngagementRate, formatViewCount, parseDuration, VIDEO_CATEGORIES } from '@/lib/youtube'

// Admin API key for protection (set in env)
const ADMIN_API_KEY = process.env.ADMIN_CACHE_REFRESH_KEY || 'trendly-refresh-2024'

// Industries to cache videos for
const INDUSTRIES = [
    'TECH', 'HEALTH', 'FITNESS', 'BEAUTY', 'FOOD',
    'TRAVEL', 'GAMING', 'ENTERTAINMENT', 'EDUCATION', 'FINANCE'
]

// Search queries per industry
const INDUSTRY_SEARCH_QUERIES: Record<string, string[]> = {
    'TECH': ['tech news today', 'AI tutorial 2024', 'gadget review', 'programming tips'],
    'HEALTH': ['health tips', 'fitness tips', 'nutrition guide', 'wellness advice', 'doctor explains'],
    'FITNESS': ['workout routine', 'gym workout', 'home exercise', 'fitness motivation', 'yoga routine'],
    'BEAUTY': ['makeup tutorial', 'skincare routine', 'beauty tips', 'grwm', 'fashion haul'],
    'FOOD': ['cooking recipe', 'food review', 'Indian recipe', 'healthy meal', 'quick recipe'],
    'TRAVEL': ['travel vlog', 'places to visit India', 'travel tips', 'adventure vlog', 'tourist places'],
    'GAMING': ['gaming India', 'BGMI gameplay', 'GTA 6 news', 'gaming setup', 'game review'],
    'ENTERTAINMENT': ['bollywood news', 'movie review 2024', 'entertainment news', 'music video', 'trending'],
    'EDUCATION': ['study tips', 'exam preparation', 'online course', 'how to learn', 'educational'],
    'FINANCE': ['stock market India', 'investing tips', 'personal finance', 'money tips', 'trading'],
}

const MIN_VIEWS = 50000

// Create Supabase admin client (service role for write access)
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(req: NextRequest) {
    try {
        // Verify admin key
        const { searchParams } = new URL(req.url)
        const apiKey = searchParams.get('key') || req.headers.get('x-admin-key')

        if (apiKey !== ADMIN_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = getSupabaseAdmin()

        // Update status to refreshing
        await supabase.from('cache_metadata').upsert({
            id: 'main',
            refresh_status: 'refreshing',
            last_error: null
        })

        let googleTrendsCount = 0
        let youtubeVideosCount = 0
        const errors: string[] = []

        // ============ STEP 1: Refresh Google Trends (1 API call) ============
        try {
            console.log('🔄 Fetching Google Trends...')
            const trends = await getDailyTrends('IN')

            // Clear old trends
            await supabase.from('cached_google_trends').delete().neq('id', 0)

            // Insert new trends
            const trendsToInsert = trends.map((trend: any) => ({
                title: trend.title,
                traffic: trend.traffic,
                formatted_traffic: trend.formattedTraffic || trend.traffic,
                related_queries: trend.relatedQueries || [],
                source: 'Google Trends',
                fetched_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }))

            const { error: insertError } = await supabase
                .from('cached_google_trends')
                .insert(trendsToInsert)

            if (insertError) throw insertError
            googleTrendsCount = trendsToInsert.length
            console.log(`✅ Cached ${googleTrendsCount} Google Trends`)
        } catch (err: any) {
            console.error('❌ Google Trends error:', err)
            errors.push(`Google Trends: ${err.message}`)
        }

        // ============ STEP 2: Refresh YouTube Videos (per industry) ============
        console.log('🔄 Fetching YouTube videos for all industries...')

        // Clear old videos
        await supabase.from('cached_youtube_videos').delete().neq('id', '')

        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

        for (const industry of INDUSTRIES) {
            const queries = INDUSTRY_SEARCH_QUERIES[industry] || []
            const allVideos: any[] = []

            for (const query of queries) {
                try {
                    const searchData = await searchVideos({
                        query: query,
                        maxResults: 10,
                        order: 'viewCount',
                        regionCode: 'IN',
                        publishedAfter: threeDaysAgo,
                    })

                    const videos = searchData.videos
                        .filter(video => video.viewCount >= MIN_VIEWS)
                        .map(video => ({
                            id: video.id,
                            title: video.title,
                            description: video.description,
                            thumbnail: video.thumbnail,
                            channel_title: video.channelTitle,
                            published_at: video.publishedAt,
                            view_count: video.viewCount,
                            like_count: video.likeCount,
                            comment_count: video.commentCount,
                            formatted_views: formatViewCount(video.viewCount),
                            formatted_likes: formatViewCount(video.likeCount),
                            formatted_comments: formatViewCount(video.commentCount),
                            formatted_duration: parseDuration(video.duration),
                            engagement_rate: calculateEngagementRate(video).toFixed(2) + '%',
                            category_name: VIDEO_CATEGORIES[video.categoryId as keyof typeof VIDEO_CATEGORIES] || 'Unknown',
                            tags: video.tags || [],
                            url: video.url,
                            industry: industry,
                            days_ago: Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)),
                            fetched_at: new Date().toISOString(),
                            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                        }))

                    allVideos.push(...videos)
                } catch (err: any) {
                    console.error(`Error fetching ${query}:`, err.message)
                }
            }

            // Deduplicate and take top 30 by views
            const uniqueVideos = Array.from(
                new Map(allVideos.map(v => [v.id, v])).values()
            ).sort((a, b) => b.view_count - a.view_count).slice(0, 30)

            if (uniqueVideos.length > 0) {
                const { error: insertError } = await supabase
                    .from('cached_youtube_videos')
                    .upsert(uniqueVideos)

                if (insertError) {
                    errors.push(`YouTube ${industry}: ${insertError.message}`)
                } else {
                    youtubeVideosCount += uniqueVideos.length
                    console.log(`✅ Cached ${uniqueVideos.length} videos for ${industry}`)
                }
            }
        }

        // ============ STEP 3: Update metadata ============
        await supabase.from('cache_metadata').upsert({
            id: 'main',
            last_google_refresh: new Date().toISOString(),
            last_youtube_refresh: new Date().toISOString(),
            google_trends_count: googleTrendsCount,
            youtube_videos_count: youtubeVideosCount,
            refresh_status: errors.length > 0 ? 'partial' : 'success',
            last_error: errors.length > 0 ? errors.join('; ') : null
        })

        console.log(`🎉 Cache refresh complete: ${googleTrendsCount} trends, ${youtubeVideosCount} videos`)

        return NextResponse.json({
            success: true,
            message: 'Cache refreshed successfully',
            stats: {
                googleTrendsCount,
                youtubeVideosCount,
                errors: errors.length > 0 ? errors : undefined
            }
        })

    } catch (error: any) {
        console.error('Cache refresh error:', error)

        // Try to update metadata with error
        try {
            const supabase = getSupabaseAdmin()
            await supabase.from('cache_metadata').upsert({
                id: 'main',
                refresh_status: 'error',
                last_error: error.message
            })
        } catch { }

        return NextResponse.json(
            { error: 'Cache refresh failed', message: error.message },
            { status: 500 }
        )
    }
}

// GET - Check cache status
export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { data: metadata } = await supabase
            .from('cache_metadata')
            .select('*')
            .eq('id', 'main')
            .single()

        return NextResponse.json({
            success: true,
            cache: metadata || { status: 'empty' }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
