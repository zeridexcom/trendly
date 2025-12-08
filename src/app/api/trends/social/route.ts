import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends } from '@/lib/google-trends'

// Keywords that indicate social media/viral content
const SOCIAL_KEYWORDS = [
    'dance', 'challenge', 'trend', 'viral', 'trending',
    'meme', 'audio', 'song', 'music', 'sound', 'filter', 'reel', 'reels',
    'tiktok', 'instagram', 'insta', 'ig',
    'edit', 'transition', 'duet', 'stitch', 'tutorial',
    'movie', 'trailer', 'actor', 'actress', 'celebrity', 'star',
    'funny', 'fail', 'win', 'reaction', 'prank', 'cute', 'dog', 'cat',
]

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

// Try to fetch from RapidAPI Instagram Hashtags (if key exists)
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
        if (Array.isArray(data)) {
            return data.slice(0, 10).map((h: any) => h.name || h.hashtag || h)
        }
        return []
    } catch (error) {
        console.error('RapidAPI error:', error)
        return []
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const geo = searchParams.get('geo') || 'IN'

        // Fetch from both sources in parallel
        const [googleTrends, rapidApiHashtags] = await Promise.all([
            getDailyTrends(geo),
            fetchRapidAPIHashtags(),
        ])

        // Process Google Trends for social relevance
        const scoredTrends = googleTrends.map(trend => ({
            ...trend,
            socialScore: scoreSocialRelevance(trend.title),
            platform: categorizePlatform(trend.title),
            source: 'google' as const,
        }))

        // Filter and sort by social score
        const socialTrends = scoredTrends
            .filter((t, i) => t.socialScore > 0 || i < 5)
            .sort((a, b) => b.socialScore - a.socialScore)
            .slice(0, 15)

        // Add RapidAPI hashtags as Instagram trends
        const rapidApiTrends = rapidApiHashtags.map((tag, i) => ({
            title: `#${tag}`,
            formattedTraffic: 'Trending',
            socialScore: 20 - i,
            platform: 'instagram' as const,
            source: 'rapidapi' as const,
        }))

        // Combine: RapidAPI first (if available), then Google filtered
        const instagramTrends = [
            ...rapidApiTrends,
            ...socialTrends.filter(t => t.platform === 'instagram' || t.platform === 'both'),
        ].slice(0, 10)

        const tiktokTrends = socialTrends
            .filter(t => t.platform === 'tiktok' || t.platform === 'both')
            .slice(0, 10)

        return NextResponse.json({
            success: true,
            data: {
                instagram: instagramTrends,
                tiktok: tiktokTrends,
                all: socialTrends,
                hasRapidApi: rapidApiHashtags.length > 0,
                fetchedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('Social trends error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch trends' }, { status: 500 })
    }
}
