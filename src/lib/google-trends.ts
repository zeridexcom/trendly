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

// Fetch daily trending searches for a region
export async function getDailyTrends(geo: string = 'IN'): Promise<TrendingSearch[]> {
    try {
        // Using a proxy or direct fetch - Google Trends doesn't have official API
        // For production, consider using SerpAPI or similar service
        const response = await fetch(
            `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        )

        const text = await response.text()

        // Parse RSS feed
        const trends: TrendingSearch[] = []
        const itemRegex = /<item>([\s\S]*?)<\/item>/g
        const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/
        const trafficRegex = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/
        const newsRegex = /<ht:news_item_url>(.*?)<\/ht:news_item_url>/
        const imageRegex = /<ht:picture>(.*?)<\/ht:picture>/

        let match
        while ((match = itemRegex.exec(text)) !== null) {
            const item = match[1]
            const title = titleRegex.exec(item)?.[1] || ''
            const traffic = trafficRegex.exec(item)?.[1] || '0'
            const newsUrl = newsRegex.exec(item)?.[1]
            const imageUrl = imageRegex.exec(item)?.[1]

            if (title) {
                trends.push({
                    title,
                    traffic,
                    relatedQueries: [],
                    newsUrl,
                    imageUrl,
                })
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
