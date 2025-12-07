// Google Trends Integration (using unofficial API)
// Fetches trending searches and interest over time

const TRENDS_BASE = 'https://trends.google.com/trends/api'

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

// Fetch daily trending searches for a region (server-side backup)
export async function getDailyTrends(geo: string = 'IN'): Promise<TrendingSearch[]> {
    try {
        // Try fetching from Google Trends via a CORS proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url='
        const trendsUrl = encodeURIComponent(`https://trends.google.com/trends/api/dailytrends?hl=en-${geo}&tz=-330&geo=${geo}&ns=15`)

        const response = await fetch(`${proxyUrl}${trendsUrl}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!response.ok) {
            throw new Error('Failed to fetch from proxy')
        }

        const text = await response.text()

        // Remove the ")]}'" prefix that Google adds for security
        const jsonText = text.replace(/^\)\]\}'\n/, '')
        const data = JSON.parse(jsonText)

        const trends: TrendingSearch[] = []

        // Parse the response - structure is default.trendingSearchesDays[0].trendingSearches
        const trendingDays = data?.default?.trendingSearchesDays || []

        for (const day of trendingDays) {
            for (const search of day.trendingSearches || []) {
                const title = search.title?.query || ''
                const traffic = search.formattedTraffic || '0'
                const imageUrl = search.image?.imageUrl
                const newsUrl = search.articles?.[0]?.url

                if (title) {
                    trends.push({
                        title,
                        traffic,
                        relatedQueries: search.relatedQueries?.map((q: any) => q.query) || [],
                        newsUrl,
                        imageUrl,
                    })
                }
            }
        }

        return trends.slice(0, 20)
    } catch (error) {
        console.error('Google Trends Error:', error)
        return []
    }
}

// Format traffic string
export function formatTraffic(traffic: string): string {
    const num = parseInt(traffic.replace(/[^0-9]/g, ''))
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
