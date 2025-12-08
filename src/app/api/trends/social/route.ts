import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends } from '@/lib/google-trends'

const SOCIAL_KEYWORDS = [
    'dance', 'challenge', 'trend', 'viral', 'trending',
    'meme', 'audio', 'song', 'music', 'sound', 'filter', 'reel', 'reels',
    'tiktok', 'instagram', 'insta', 'ig',
    'edit', 'transition', 'duet', 'stitch', 'tutorial',
    'movie', 'trailer', 'actor', 'actress', 'celebrity', 'star',
    'funny', 'fail', 'win', 'reaction', 'prank', 'cute', 'dog', 'cat',
]

// ============================================
// 48-HOUR CACHE FOR RAPIDAPI (saves API calls)
// ============================================
interface CachedData {
    hashtags: string[]
    fetchedAt: number
}

let rapidApiCache: CachedData | null = null
const CACHE_DURATION = 48 * 60 * 60 * 1000 // 48 hours in ms

// Curated hashtags as fallback
const INSTAGRAM_TRENDING_HASHTAGS = {
    viral: ['fyp', 'viral', 'trending', 'explore', 'foryou', 'foryoupage', 'viralpost'],
    reels: ['reels', 'reelsinstagram', 'instareels', 'reelsvideo', 'reelitfeelit', 'trendingreels'],
    lifestyle: ['lifestyle', 'aesthetic', 'mood', 'vibes', 'ootd', 'style', 'fashion'],
    entertainment: ['music', 'dance', 'funny', 'comedy', 'memes', 'bollywood', 'hollywood'],
    motivation: ['motivation', 'inspiration', 'quotes', 'success', 'mindset', 'goals'],
    photography: ['photography', 'photooftheday', 'instagood', 'picoftheday', 'instadaily'],
}

function scoreSocialRelevance(title: string): number {
    const titleLower = title.toLowerCase()
    let score = 0
    SOCIAL_KEYWORDS.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 10
    })
    if (title.length < 30) score += 5
    return score
}

function categorizePlatform(title: string): 'instagram' | 'tiktok' | 'both' {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('dance') || titleLower.includes('challenge') || titleLower.includes('audio')) return 'tiktok'
    if (titleLower.includes('reel') || titleLower.includes('filter') || titleLower.includes('photo')) return 'instagram'
    return 'both'
}

// Curated hashtags (rotates daily)
function getCuratedHashtags(): { hashtag: string; category: string }[] {
    const today = new Date()
    const day = today.getDay()
    const categories = Object.keys(INSTAGRAM_TRENDING_HASHTAGS)

    const result: { hashtag: string; category: string }[] = []

    // Always add top viral
    result.push({ hashtag: 'fyp', category: 'viral' })
    result.push({ hashtag: 'viral', category: 'viral' })
    result.push({ hashtag: 'trending', category: 'viral' })

    // Rotate through categories based on day
    for (let i = 0; i < 3; i++) {
        const cat = categories[(day + i) % categories.length]
        const tags = INSTAGRAM_TRENDING_HASHTAGS[cat as keyof typeof INSTAGRAM_TRENDING_HASHTAGS]
        tags.slice(0, 3).forEach(t => result.push({ hashtag: t, category: cat }))
    }

    // Deduplicate
    const seen = new Set<string>()
    return result.filter(h => {
        if (seen.has(h.hashtag)) return false
        seen.add(h.hashtag)
        return true
    })
}

// Fetch from RapidAPI with 48-hour cache
async function fetchRapidAPIWithCache(): Promise<string[]> {
    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) {
        console.log('No RAPIDAPI_KEY, using curated hashtags')
        return []
    }

    // Check cache first
    const now = Date.now()
    if (rapidApiCache && (now - rapidApiCache.fetchedAt) < CACHE_DURATION) {
        console.log('Using cached RapidAPI data (expires in', Math.round((CACHE_DURATION - (now - rapidApiCache.fetchedAt)) / 3600000), 'hours)')
        return rapidApiCache.hashtags
    }

    // Cache expired or doesn't exist - make API call
    console.log('Fetching fresh data from RapidAPI...')
    try {
        const response = await fetch('https://instagram-scraper-stable-api.p.rapidapi.com/v1/search/hashtags?query=trending', {
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'instagram-scraper-stable-api.p.rapidapi.com',
            },
        })

        if (!response.ok) {
            console.log('RapidAPI error:', response.status)
            return rapidApiCache?.hashtags || []
        }

        const data = await response.json()
        let hashtags: string[] = []

        // Parse response - different APIs have different formats
        if (data.data && Array.isArray(data.data)) {
            hashtags = data.data.slice(0, 15).map((h: any) => h.name || h.hashtag || h.title || h)
        } else if (Array.isArray(data)) {
            hashtags = data.slice(0, 15).map((h: any) => h.name || h.hashtag || h.title || h)
        } else if (data.hashtags) {
            hashtags = data.hashtags.slice(0, 15).map((h: any) => typeof h === 'string' ? h : h.name || h.hashtag)
        }

        // Filter valid hashtags
        hashtags = hashtags.filter((h: any) => typeof h === 'string' && h.length > 1)

        if (hashtags.length > 0) {
            // Update cache
            rapidApiCache = {
                hashtags,
                fetchedAt: now,
            }
            console.log('Cached', hashtags.length, 'hashtags for 48 hours')
        }

        return hashtags
    } catch (error) {
        console.error('RapidAPI fetch error:', error)
        return rapidApiCache?.hashtags || []
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        let geo = searchParams.get('geo') || 'IN'
        let userIndustry: string | null = searchParams.get('industry') || null

        // Try to get user preferences if authenticated
        try {
            const { createClient } = await import('@/lib/supabase/server')
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.user_metadata) {
                geo = user.user_metadata.location || geo
                userIndustry = user.user_metadata.industry || userIndustry
            }
        } catch {
            // Not authenticated, use query params
        }

        // Fetch all sources in parallel
        const [googleTrends, rapidApiHashtags] = await Promise.all([
            getDailyTrends(geo),
            fetchRapidAPIWithCache(),
        ])

        // Get curated hashtags as fallback/supplement
        const curatedHashtags = getCuratedHashtags()

        // Process Google Trends - boost scores for user's industry
        const scoredTrends = googleTrends.map(trend => {
            let score = scoreSocialRelevance(trend.title)
            // Boost score if matches user's industry
            if (userIndustry && trend.industry === userIndustry) {
                score += 20 // Priority boost for matching industry
            }
            return {
                ...trend,
                socialScore: score,
                platform: categorizePlatform(trend.title),
                source: 'google' as const,
                matchesIndustry: trend.industry === userIndustry,
            }
        })

        // Sort by score (industry matches first)
        const socialTrends = scoredTrends
            .filter((t, i) => t.socialScore > 0 || i < 5)
            .sort((a, b) => b.socialScore - a.socialScore)
            .slice(0, 15)

        // Build Instagram trends: RapidAPI (cached) > Curated > Google
        const instagramFromRapidApi = rapidApiHashtags.map((tag, i) => ({
            title: `#${tag.replace('#', '')}`,
            formattedTraffic: 'Trending',
            socialScore: 30 - i,
            platform: 'instagram' as const,
            source: 'instagram' as const, // Real Instagram data!
            category: 'trending',
        }))

        const instagramFromCurated = curatedHashtags.map((h, i) => ({
            title: `#${h.hashtag}`,
            formattedTraffic: 'Popular',
            socialScore: 20 - i,
            platform: 'instagram' as const,
            source: 'curated' as const,
            category: h.category,
        }))

        const instagramFromGoogle = socialTrends
            .filter(t => t.platform === 'instagram' || t.platform === 'both')
            .map(t => ({ ...t, category: 'viral' }))

        // Priority: RapidAPI first (real Instagram data), then curated, then Google
        const instagramTrends = [
            ...instagramFromRapidApi,
            ...instagramFromCurated,
            ...instagramFromGoogle,
        ].slice(0, 15)

        const tiktokTrends = socialTrends
            .filter(t => t.platform === 'tiktok' || t.platform === 'both')
            .slice(0, 10)

        // Get industry-specific trends for user
        const industryTrends = userIndustry
            ? socialTrends.filter(t => t.matchesIndustry).slice(0, 8)
            : []

        return NextResponse.json({
            success: true,
            data: {
                instagram: instagramTrends,
                tiktok: tiktokTrends,
                all: socialTrends,
                forYou: industryTrends, // Personalized based on industry
                sources: {
                    rapidApi: rapidApiHashtags.length > 0,
                    rapidApiCached: rapidApiCache ? Math.round((Date.now() - rapidApiCache.fetchedAt) / 3600000) + 'h ago' : null,
                    curated: true,
                    googleTrends: true,
                },
                fetchedAt: new Date().toISOString(),
            },
            personalization: {
                industry: userIndustry || 'ALL',
                location: geo,
            }
        })
    } catch (error: any) {
        console.error('Social trends error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch trends' }, { status: 500 })
    }
}
