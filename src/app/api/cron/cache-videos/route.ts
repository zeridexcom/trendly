import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getNextKey, markKeyUsed } from '@/lib/youtube-key-manager'

/**
 * Automated YouTube Video Cache Cron Job
 * Runs hourly and caches 200 videos for one niche at a time
 * Rotates through all niches over multiple runs
 */

const NICHES = ['TECH', 'HEALTH', 'GAMING', 'ENTERTAINMENT', 'BUSINESS', 'FASHION', 'FOOD', 'EDUCATION', 'TRAVEL', 'FITNESS', 'FINANCE']

const NICHE_QUERIES: Record<string, string[]> = {
    TECH: ['tech news 2025', 'new technology', 'gadget review', 'AI tools', 'programming tutorial', 'smartphone review', 'laptop review', 'tech tips'],
    HEALTH: ['health tips', 'fitness routine', 'workout', 'nutrition tips', 'wellness', 'healthy lifestyle', 'mental health', 'yoga'],
    GAMING: ['gaming', 'gameplay', 'game review', 'esports', 'gaming setup', 'best games 2025', 'gaming tips', 'mobile gaming'],
    ENTERTAINMENT: ['movie review', 'tv show review', 'celebrity news', 'bollywood', 'music video', 'comedy', 'entertainment news', 'web series'],
    BUSINESS: ['business tips', 'startup ideas', 'entrepreneurship', 'marketing tips', 'investing', 'stock market', 'finance tips', 'side hustle'],
    FASHION: ['fashion trends', 'outfit ideas', 'style tips', 'beauty tips', 'makeup tutorial', 'skincare routine', 'fashion haul'],
    FOOD: ['recipes', 'cooking', 'food review', 'street food', 'easy recipes', 'healthy meals', 'baking', 'restaurant review'],
    EDUCATION: ['study tips', 'how to learn', 'tutorial', 'exam preparation', 'online course', 'educational', 'learning hacks'],
    TRAVEL: ['travel vlog', 'travel tips', 'places to visit', 'travel guide', 'adventure', 'budget travel', 'travel 2025'],
    FITNESS: ['fitness', 'workout routine', 'gym', 'exercise', 'bodybuilding', 'home workout', 'weight training'],
    FINANCE: ['personal finance', 'investing tips', 'stock market', 'crypto', 'money management', 'financial freedom', 'budgeting'],
}

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// Get which niche to cache next (rotates through all niches)
async function getNextNiche(): Promise<string> {
    const supabase = getSupabaseAdmin()

    // Find niche with oldest cache or least videos
    const { data } = await supabase
        .from('youtube_video_cache')
        .select('niche, cached_at')
        .order('cached_at', { ascending: true })
        .limit(1)

    if (!data || data.length === 0) {
        return NICHES[0] // Start with TECH if empty
    }

    // Get count per niche and find the one with least videos
    const counts: Record<string, number> = {}
    for (const niche of NICHES) {
        const { count } = await supabase
            .from('youtube_video_cache')
            .select('*', { count: 'exact', head: true })
            .eq('niche', niche)
        counts[niche] = count || 0
    }

    // Find niche with least videos (under 200)
    const underCached = NICHES.filter(n => counts[n] < 200)
    if (underCached.length > 0) {
        return underCached[0]
    }

    // All niches have 200+, rotate based on oldest update
    const oldestNiche = data[0]?.niche || NICHES[0]
    const currentIndex = NICHES.indexOf(oldestNiche)
    return NICHES[(currentIndex + 1) % NICHES.length]
}

async function fetchAndCacheVideos(niche: string, targetCount: number = 200): Promise<number> {
    const supabase = getSupabaseAdmin()
    const queries = NICHE_QUERIES[niche] || ['trending']
    let cached = 0
    let displayOrder = Date.now()

    for (const query of queries) {
        if (cached >= targetCount) break

        const apiKey = getNextKey()
        if (!apiKey) {
            console.log('[Cron] All API keys exhausted')
            break
        }

        try {
            // Search videos
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&type=video&maxResults=50&q=${encodeURIComponent(query + ' 2025')}` +
                `&order=viewCount&regionCode=IN&relevanceLanguage=en&key=${apiKey}`

            const searchRes = await fetch(searchUrl)
            const searchData = await searchRes.json()

            markKeyUsed(apiKey, 100)

            if (searchData.error) {
                console.log(`[Cron] Search error for ${query}:`, searchData.error.message)
                continue
            }

            const videoIds = (searchData.items || []).map((item: any) => item.id?.videoId).filter(Boolean)
            if (videoIds.length === 0) continue

            // Get video stats
            const statsKey = getNextKey()
            if (!statsKey) break

            const statsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
                `part=statistics,contentDetails&id=${videoIds.join(',')}&key=${statsKey}`

            const statsRes = await fetch(statsUrl)
            const statsData = await statsRes.json()
            markKeyUsed(statsKey, 1)

            const statsMap: Record<string, any> = {}
            for (const item of statsData.items || []) {
                statsMap[item.id] = {
                    viewCount: parseInt(item.statistics?.viewCount || '0'),
                    likeCount: parseInt(item.statistics?.likeCount || '0'),
                    commentCount: parseInt(item.statistics?.commentCount || '0'),
                    duration: item.contentDetails?.duration
                }
            }

            // Save to database
            for (const item of searchData.items || []) {
                if (cached >= targetCount) break

                const stats = statsMap[item.id?.videoId] || {}
                if (stats.viewCount < 10000) continue // Only 10K+ views

                const { error } = await supabase
                    .from('youtube_video_cache')
                    .upsert({
                        video_id: item.id?.videoId,
                        title: item.snippet?.title,
                        description: item.snippet?.description?.slice(0, 500),
                        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
                        channel_title: item.snippet?.channelTitle,
                        channel_id: item.snippet?.channelId,
                        published_at: item.snippet?.publishedAt,
                        view_count: stats.viewCount,
                        like_count: stats.likeCount,
                        comment_count: stats.commentCount,
                        duration: stats.duration,
                        niche: niche,
                        country: 'IN',
                        display_order: displayOrder++,
                        is_active: true,
                        cached_at: new Date().toISOString(),
                        last_updated: new Date().toISOString()
                    }, { onConflict: 'video_id' })

                if (!error) cached++
            }

        } catch (err) {
            console.error(`[Cron] Error for ${query}:`, err)
        }
    }

    return cached
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Verify cron secret
    if (key !== 'trendly-cron-2025' && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        console.log('[Cron] Starting YouTube cache job...')

        const niche = await getNextNiche()
        console.log(`[Cron] Caching niche: ${niche}`)

        const cached = await fetchAndCacheVideos(niche, 200)

        console.log(`[Cron] Cached ${cached} videos for ${niche}`)

        return NextResponse.json({
            success: true,
            niche,
            videosCached: cached,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('[Cron] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
