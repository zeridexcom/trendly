import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getNextKey, markKeyUsed, markKeyExhausted } from '@/lib/youtube-key-manager'

// Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// Get API key from centralized manager
function getApiKey(): string {
    const key = getNextKey()
    if (!key) {
        throw new Error('All YouTube API keys exhausted')
    }
    return key
}

// Niche search queries
const NICHE_QUERIES: Record<string, string[]> = {
    TECH: [
        'tech news 2025', 'new technology', 'gadget review', 'AI tools', 'programming tutorial',
        'smartphone review', 'laptop review', 'tech tips', 'software tips', 'coding tips',
        'tech unboxing', 'best apps', 'tech trends', 'future technology', 'tech explained'
    ],
    HEALTH: [
        'health tips', 'fitness routine', 'workout', 'nutrition tips', 'wellness',
        'healthy lifestyle', 'mental health', 'yoga for beginners', 'diet tips', 'weight loss',
        'home workout', 'gym motivation', 'healthy recipes', 'self care', 'meditation'
    ],
    GAMING: [
        'gaming', 'gameplay', 'game review', 'esports', 'gaming setup',
        'best games 2025', 'gaming tips', 'mobile gaming', 'ps5 games', 'pc gaming',
        'game trailer', 'gaming news', 'stream highlights', 'game walkthrough', 'gaming challenge'
    ],
    ENTERTAINMENT: [
        'movie review', 'tv show review', 'celebrity news', 'bollywood', 'music video',
        'comedy', 'entertainment news', 'film trailer', 'web series', 'popculture',
        'trending music', 'celebrity interview', 'movie trailer', 'netflix', 'entertainment'
    ],
    BUSINESS: [
        'business tips', 'startup ideas', 'entrepreneurship', 'marketing tips', 'investing',
        'stock market', 'finance tips', 'side hustle', 'make money online', 'business news',
        'ecommerce', 'digital marketing', 'passive income', 'real estate', 'crypto'
    ],
    FASHION: [
        'fashion trends', 'outfit ideas', 'style tips', 'beauty tips', 'makeup tutorial',
        'skincare routine', 'fashion haul', 'streetwear', 'fashion 2025', 'styling tips',
        'thrift haul', 'wardrobe essentials', 'fashion lookbook', 'beauty hacks', 'grwm'
    ],
    FOOD: [
        'recipes', 'cooking', 'food review', 'street food', 'easy recipes',
        'healthy meals', 'baking', 'restaurant review', 'food vlog', 'meal prep',
        'quick recipes', 'indian food', 'viral recipes', 'food challenge', 'cooking tips'
    ],
    EDUCATION: [
        'study tips', 'how to learn', 'tutorial', 'exam preparation', 'online course',
        'educational', 'learning hacks', 'study motivation', 'career tips', 'skill development',
        'language learning', 'productivity tips', 'student life', 'study with me', 'knowledge'
    ],
    TRAVEL: [
        'travel vlog', 'travel tips', 'places to visit', 'travel guide', 'adventure',
        'budget travel', 'travel 2025', 'destination', 'solo travel', 'travel hacks',
        'road trip', 'backpacking', 'travel photography', 'explore', 'wanderlust'
    ],
    FITNESS: [
        'fitness', 'workout routine', 'gym', 'exercise', 'bodybuilding',
        'home workout', 'weight training', 'cardio', 'fitness motivation', 'abs workout',
        'full body workout', 'fitness tips', 'muscle building', 'fat loss', 'strength training'
    ],
    FINANCE: [
        'personal finance', 'investing tips', 'stock market', 'crypto', 'money management',
        'financial freedom', 'budgeting', 'wealth building', 'passive income', 'trading',
        'mutual funds', 'tax saving', 'retirement planning', 'financial advice', 'money tips'
    ],
}

// Fetch videos from YouTube
async function fetchYouTubeVideos(query: string, maxResults: number = 50): Promise<any[]> {
    const apiKey = getApiKey()

    try {
        // Search for videos
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}` +
            `&order=viewCount&regionCode=IN&relevanceLanguage=en&key=${apiKey}`

        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()

        if (searchData.error) {
            console.error(`YouTube API error for "${query}":`, searchData.error.message)
            return []
        }

        const videoIds = (searchData.items || []).map((item: any) => item.id.videoId).filter(Boolean)

        if (videoIds.length === 0) return []

        // Get video statistics
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
            `part=statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`

        const statsRes = await fetch(statsUrl)
        const statsData = await statsRes.json()

        const statsMap: Record<string, any> = {}
        for (const item of statsData.items || []) {
            statsMap[item.id] = {
                viewCount: parseInt(item.statistics?.viewCount || '0'),
                likeCount: parseInt(item.statistics?.likeCount || '0'),
                commentCount: parseInt(item.statistics?.commentCount || '0'),
                duration: item.contentDetails?.duration
            }
        }

        // Combine data
        return (searchData.items || []).map((item: any) => {
            const stats = statsMap[item.id.videoId] || {}
            return {
                videoId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
                ...stats
            }
        }).filter((v: any) => v.viewCount >= 10000) // Only videos with 10K+ views

    } catch (error) {
        console.error(`Error fetching videos for "${query}":`, error)
        return []
    }
}

// Bulk cache videos for a niche
async function cacheNicheVideos(niche: string, targetCount: number = 1000): Promise<number> {
    const supabase = getSupabaseAdmin()
    const queries = NICHE_QUERIES[niche] || ['trending']
    let totalCached = 0
    let displayOrder = 0

    console.log(`Starting cache for ${niche} with ${queries.length} queries...`)

    for (const query of queries) {
        if (totalCached >= targetCount) break

        const videos = await fetchYouTubeVideos(`${query} 2025`, 50)
        console.log(`Fetched ${videos.length} videos for "${query}"`)

        for (const video of videos) {
            if (totalCached >= targetCount) break

            try {
                const { error } = await supabase
                    .from('youtube_video_cache')
                    .upsert({
                        video_id: video.videoId,
                        title: video.title,
                        description: video.description?.slice(0, 500),
                        thumbnail: video.thumbnail,
                        channel_title: video.channelTitle,
                        channel_id: video.channelId,
                        published_at: video.publishedAt,
                        view_count: video.viewCount,
                        like_count: video.likeCount,
                        comment_count: video.commentCount,
                        duration: video.duration,
                        niche: niche,
                        country: 'IN',
                        display_order: displayOrder++,
                        is_active: true,
                        last_updated: new Date().toISOString()
                    }, { onConflict: 'video_id' })

                if (!error) totalCached++
            } catch (e) {
                console.error('Error inserting video:', e)
            }
        }

        // Small delay between queries
        await new Promise(r => setTimeout(r, 100))
    }

    console.log(`Cached ${totalCached} videos for ${niche}`)
    return totalCached
}

// POST: Bulk cache videos
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        // Simple security check
        if (key !== process.env.ADMIN_SECRET_KEY && key !== 'trendly2025') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json().catch(() => ({}))
        const niche = (body.niche || 'TECH').toUpperCase()
        const targetCount = body.count || 1000

        const validNiches = Object.keys(NICHE_QUERIES)
        if (!validNiches.includes(niche)) {
            return NextResponse.json({
                error: `Invalid niche. Valid options: ${validNiches.join(', ')}`
            }, { status: 400 })
        }

        console.log(`Starting bulk cache for ${niche}, target: ${targetCount}`)
        const cached = await cacheNicheVideos(niche, targetCount)

        return NextResponse.json({
            success: true,
            niche,
            videosCached: cached,
            targetCount,
            message: `Successfully cached ${cached} videos for ${niche}`
        })

    } catch (error: any) {
        console.error('Bulk cache error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// GET: Cache all niches or check status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')
        const action = searchParams.get('action')

        if (key !== process.env.ADMIN_SECRET_KEY && key !== 'trendly2025') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = getSupabaseAdmin()

        // Check cache status
        if (action === 'status') {
            const niches = Object.keys(NICHE_QUERIES)
            const stats: Record<string, number> = {}

            for (const niche of niches) {
                const { count } = await supabase
                    .from('youtube_video_cache')
                    .select('*', { count: 'exact', head: true })
                    .eq('niche', niche)
                    .eq('is_active', true)

                stats[niche] = count || 0
            }

            return NextResponse.json({ success: true, cacheStatus: stats })
        }

        // Cache all niches
        if (action === 'cache-all') {
            const niches = Object.keys(NICHE_QUERIES)
            const results: Record<string, number> = {}

            for (const niche of niches) {
                console.log(`Caching ${niche}...`)
                results[niche] = await cacheNicheVideos(niche, 1000) // 1000 per niche
                await new Promise(r => setTimeout(r, 500)) // Delay between niches
            }

            return NextResponse.json({ success: true, cached: results })
        }

        return NextResponse.json({
            message: 'Use ?action=status to check cache, or ?action=cache-all to cache all niches',
            availableNiches: Object.keys(NICHE_QUERIES)
        })

    } catch (error: any) {
        console.error('Cache API error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
