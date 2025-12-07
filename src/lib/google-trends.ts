// Google Trends Integration using SerpApi
// Real-time trending searches with smart caching

interface TrendingSearch {
    title: string
    traffic: string
    relatedQueries: string[]
    newsUrl?: string
    imageUrl?: string
}

interface TrendData {
    keyword: string
    interest: number[]
    dates: string[]
    relatedTopics: string[]
    relatedQueries: string[]
}

// In-memory cache for trending data
interface TrendCache {
    data: TrendingSearch[]
    timestamp: number
    geo: string
}

let trendCache: TrendCache | null = null
const CACHE_DURATION = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

// Fetch daily trending searches using SerpApi
export async function getDailyTrends(geo: string = 'IN'): Promise<TrendingSearch[]> {
    const apiKey = process.env.SERPAPI_KEY

    if (!apiKey) {
        console.error('SERPAPI_KEY not configured')
        return []
    }

    // Check cache first
    const now = Date.now()
    if (trendCache && trendCache.geo === geo && (now - trendCache.timestamp) < CACHE_DURATION) {
        console.log('Returning cached Google Trends data')
        return trendCache.data
    }

    try {
        console.log('Fetching fresh Google Trends from SerpApi...')

        // SerpApi Google Trends Daily endpoint
        const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=${geo}&api_key=${apiKey}`

        const response = await fetch(url, {
            next: { revalidate: 10800 } // Next.js cache for 3 hours
        })

        if (!response.ok) {
            throw new Error(`SerpApi error: ${response.status}`)
        }

        const data = await response.json()

        const trends: TrendingSearch[] = []

        // Parse SerpApi response
        const trendingSearches = data?.trending_searches || data?.daily_searches || []

        for (const search of trendingSearches) {
            const title = search.query || search.title || ''
            const traffic = search.search_volume || search.formattedTraffic || search.traffic || '0'

            if (title) {
                trends.push({
                    title,
                    traffic: typeof traffic === 'number' ? traffic.toString() : traffic,
                    relatedQueries: search.related_queries?.map((q: any) => q.query || q) || [],
                    newsUrl: search.articles?.[0]?.link || search.news_url,
                    imageUrl: search.image?.imageUrl || search.thumbnail,
                })
            }
        }

        // Update cache
        if (trends.length > 0) {
            trendCache = {
                data: trends.slice(0, 20),
                timestamp: now,
                geo
            }
            console.log(`Cached ${trends.length} Google Trends for ${geo}`)
        }

        return trends.slice(0, 20)
    } catch (error) {
        console.error('SerpApi Google Trends Error:', error)

        // Return cached data if available (even if expired)
        if (trendCache && trendCache.geo === geo) {
            console.log('Returning stale cached data due to error')
            return trendCache.data
        }

        return []
    }
}

// Format traffic string
export function formatTraffic(traffic: string): string {
    const num = parseInt(traffic.replace(/[^0-9]/g, ''))
    if (isNaN(num)) return traffic
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+'
    return num + '+'
}

// Trending topic categories for content ideas
export const TRENDING_CATEGORIES = [
    { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { id: 'technology', label: 'Technology', emoji: '💻' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'business', label: 'Business', emoji: '💼' },
    { id: 'health', label: 'Health', emoji: '🏥' },
    { id: 'science', label: 'Science', emoji: '🔬' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'food', label: 'Food', emoji: '🍕' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
    { id: 'finance', label: 'Finance', emoji: '💰' },
] as const

export type TrendCategory = typeof TRENDING_CATEGORIES[number]['id']
