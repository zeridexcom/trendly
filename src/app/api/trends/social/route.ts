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

// Popular Instagram hashtag categories (curated + AI-enhanced)
const INSTAGRAM_TRENDING_HASHTAGS = {
    viral: ['fyp', 'viral', 'trending', 'explore', 'foryou', 'foryoupage', 'viralpost', 'viralvideos'],
    reels: ['reels', 'reelsinstagram', 'instareels', 'reelsvideo', 'reelitfeelit', 'reelsviral', 'trendingreels'],
    lifestyle: ['lifestyle', 'aesthetic', 'mood', 'vibes', 'dailylife', 'ootd', 'style', 'fashion'],
    entertainment: ['music', 'dance', 'funny', 'comedy', 'memes', 'entertainment', 'bollywood', 'hollywood'],
    motivation: ['motivation', 'inspiration', 'quotes', 'success', 'mindset', 'goals', 'hustle'],
    photography: ['photography', 'photooftheday', 'instagood', 'picoftheday', 'photo', 'instadaily'],
}

function scoreSocialRelevance(title: string): number {
    const titleLower = title.toLowerCase()
    let score = 0
    SOCIAL_KEYWORDS.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 10
    })
    if (title.length < 30) score += 5
    if (title.match(/^[A-Z][a-z]+\s[A-Z][a-z]+/)) score += 3
    return score
}

function categorizePlatform(title: string): 'instagram' | 'tiktok' | 'both' {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('dance') || titleLower.includes('challenge') || titleLower.includes('audio')) return 'tiktok'
    if (titleLower.includes('reel') || titleLower.includes('filter') || titleLower.includes('photo')) return 'instagram'
    return 'both'
}

// Get trending Instagram hashtags (curated + rotated daily)
function getInstagramTrendingHashtags(): { hashtag: string; category: string }[] {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const hour = today.getHours()

    // Rotate categories based on day and hour for variety
    const categories = Object.keys(INSTAGRAM_TRENDING_HASHTAGS)
    const primaryCategory = categories[dayOfWeek % categories.length]
    const secondaryCategory = categories[(dayOfWeek + 1) % categories.length]
    const tertiaryCategory = categories[(hour % categories.length)]

    const hashtags: { hashtag: string; category: string }[] = []

    // Add from primary category
    const primary = INSTAGRAM_TRENDING_HASHTAGS[primaryCategory as keyof typeof INSTAGRAM_TRENDING_HASHTAGS]
    primary.slice(0, 4).forEach(h => hashtags.push({ hashtag: h, category: primaryCategory }))

    // Add from secondary  
    const secondary = INSTAGRAM_TRENDING_HASHTAGS[secondaryCategory as keyof typeof INSTAGRAM_TRENDING_HASHTAGS]
    secondary.slice(0, 3).forEach(h => hashtags.push({ hashtag: h, category: secondaryCategory }))

    // Add from tertiary
    const tertiary = INSTAGRAM_TRENDING_HASHTAGS[tertiaryCategory as keyof typeof INSTAGRAM_TRENDING_HASHTAGS]
    tertiary.slice(0, 3).forEach(h => hashtags.push({ hashtag: h, category: tertiaryCategory }))

    // Always include top viral ones
    hashtags.unshift({ hashtag: 'trending', category: 'viral' })
    hashtags.unshift({ hashtag: 'viral', category: 'viral' })
    hashtags.unshift({ hashtag: 'fyp', category: 'viral' })

    // Deduplicate
    const seen = new Set<string>()
    return hashtags.filter(h => {
        if (seen.has(h.hashtag)) return false
        seen.add(h.hashtag)
        return true
    }).slice(0, 12)
}

// Try RapidAPI if key exists
async function fetchRapidAPIHashtags(): Promise<string[]> {
    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) return []

    try {
        const response = await fetch('https://instagram-hashtags1.p.rapidapi.com/trending', {
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'instagram-hashtags1.p.rapidapi.com',
            },
        })
        if (!response.ok) return []
        const data = await response.json()
        if (Array.isArray(data)) return data.slice(0, 10).map((h: any) => h.name || h.hashtag || h)
        return []
    } catch { return [] }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const geo = searchParams.get('geo') || 'IN'

        // Fetch all sources in parallel
        const [googleTrends, rapidApiHashtags] = await Promise.all([
            getDailyTrends(geo),
            fetchRapidAPIHashtags(),
        ])

        // Get curated Instagram hashtags
        const curatedHashtags = getInstagramTrendingHashtags()

        // Process Google Trends for social relevance
        const scoredTrends = googleTrends.map(trend => ({
            ...trend,
            socialScore: scoreSocialRelevance(trend.title),
            platform: categorizePlatform(trend.title),
            source: 'google' as const,
        }))

        const socialTrends = scoredTrends
            .filter((t, i) => t.socialScore > 0 || i < 5)
            .sort((a, b) => b.socialScore - a.socialScore)
            .slice(0, 15)

        // Build Instagram trends: RapidAPI > Curated > Google filtered
        const instagramFromRapidApi = rapidApiHashtags.map((tag, i) => ({
            title: `#${tag}`,
            formattedTraffic: 'Trending',
            socialScore: 25 - i,
            platform: 'instagram' as const,
            source: 'rapidapi' as const,
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

        // Combine: RapidAPI first, then curated, then Google
        const instagramTrends = [
            ...instagramFromRapidApi,
            ...instagramFromCurated,
            ...instagramFromGoogle,
        ].slice(0, 12)

        const tiktokTrends = socialTrends
            .filter(t => t.platform === 'tiktok' || t.platform === 'both')
            .slice(0, 10)

        return NextResponse.json({
            success: true,
            data: {
                instagram: instagramTrends,
                tiktok: tiktokTrends,
                all: socialTrends,
                sources: {
                    rapidApi: rapidApiHashtags.length > 0,
                    curated: true,
                    googleTrends: true,
                },
                fetchedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('Social trends error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch trends' }, { status: 500 })
    }
}
