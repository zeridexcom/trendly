// Google Trends Integration using SerpApi
// Real-time trending searches with smart caching and personalization

interface TrendingSearch {
    title: string
    traffic: string
    relatedQueries: string[]
    newsUrl?: string
    imageUrl?: string
    industry?: string // Added for personalization
}

interface TrendData {
    keyword: string
    interest: number[]
    dates: string[]
    relatedTopics: string[]
    relatedQueries: string[]
}

// Multi-location cache
interface TrendCache {
    data: TrendingSearch[]
    timestamp: number
}

// Cache per location
const trendCaches: Record<string, TrendCache> = {}
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours for efficiency

// Industry keywords for categorization
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
    TECH: [
        'iphone', 'android', 'samsung', 'google', 'apple', 'microsoft', 'ai', 'chatgpt',
        'software', 'app', 'tech', 'laptop', 'computer', 'smartphone', 'gadget', 'nvidia',
        'coding', 'programming', 'startup', 'elon', 'tesla', 'spacex', 'crypto', 'blockchain'
    ],
    ENTERTAINMENT: [
        'movie', 'film', 'actor', 'actress', 'bollywood', 'hollywood', 'netflix', 'series',
        'bigg boss', 'celebrity', 'award', 'oscar', 'grammy', 'tv show', 'drama', 'comedy',
        'trailer', 'release', 'premiere', 'album', 'song', 'music video'
    ],
    BUSINESS: [
        'stock', 'market', 'share', 'nifty', 'sensex', 'investment', 'business', 'company',
        'revenue', 'profit', 'startup', 'funding', 'merger', 'acquisition', 'ceo', 'economy',
        'gdp', 'inflation', 'rbi', 'fed', 'interest rate', 'tax'
    ],
    GAMING: [
        'game', 'gaming', 'bgmi', 'pubg', 'fortnite', 'minecraft', 'gta', 'call of duty',
        'valorant', 'esports', 'playstation', 'xbox', 'nintendo', 'steam', 'twitch', 'streamer',
        'update', 'patch', 'dlc', 'free fire', 'mobile legends'
    ],
    HEALTH: [
        'health', 'fitness', 'gym', 'workout', 'diet', 'weight', 'yoga', 'meditation',
        'disease', 'virus', 'vaccine', 'hospital', 'doctor', 'medicine', 'wellness',
        'mental health', 'nutrition', 'exercise', 'healthy'
    ],
    FASHION: [
        'fashion', 'style', 'outfit', 'dress', 'clothing', 'brand', 'designer', 'model',
        'trend', 'beauty', 'makeup', 'skincare', 'hairstyle', 'accessory', 'luxury',
        'gucci', 'zara', 'h&m', 'aesthetic'
    ],
    EDUCATION: [
        'exam', 'result', 'university', 'college', 'school', 'student', 'study', 'course',
        'degree', 'jee', 'neet', 'upsc', 'education', 'learning', 'online class', 'scholarship',
        'admission', 'entrance', 'board'
    ],
    FOOD: [
        'food', 'recipe', 'cooking', 'restaurant', 'chef', 'dish', 'cuisine', 'meal',
        'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'street food', 'viral food',
        'kitchen', 'baking', 'foodie'
    ],
    TRAVEL: [
        'travel', 'trip', 'vacation', 'holiday', 'destination', 'flight', 'hotel', 'tourism',
        'beach', 'mountain', 'adventure', 'explore', 'wanderlust', 'backpack', 'visa',
        'airline', 'booking', 'tourist'
    ],
    NEWS: [
        'news', 'breaking', 'politics', 'election', 'government', 'minister', 'parliament',
        'court', 'law', 'crime', 'protest', 'rally', 'international', 'world', 'nation',
        'statement', 'controversy', 'scandal'
    ],
}

// Categorize a trend by industry
export function categorizeTrend(title: string): string {
    const lowerTitle = title.toLowerCase()

    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerTitle.includes(keyword)) {
                return industry
            }
        }
    }

    return 'OTHER' // Default if no match
}

// Fetch daily trending searches using SerpApi with multi-location caching
export async function getDailyTrends(geo: string = 'IN'): Promise<TrendingSearch[]> {
    const apiKey = process.env.SERPAPI_KEY

    if (!apiKey) {
        console.error('SERPAPI_KEY not configured')
        return []
    }

    // Check cache first
    const now = Date.now()
    const cache = trendCaches[geo]
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
        console.log(`Returning cached Google Trends for ${geo}`)
        return cache.data
    }

    try {
        console.log(`Fetching fresh Google Trends from SerpApi for ${geo}...`)

        const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=${geo}&api_key=${apiKey}`

        const response = await fetch(url, {
            next: { revalidate: 21600 } // Next.js cache for 6 hours
        })

        if (!response.ok) {
            throw new Error(`SerpApi error: ${response.status}`)
        }

        const data = await response.json()
        const trends: TrendingSearch[] = []
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
                    industry: categorizeTrend(title), // Auto-categorize
                })
            }
        }

        // Update cache
        if (trends.length > 0) {
            trendCaches[geo] = {
                data: trends.slice(0, 25),
                timestamp: now,
            }
            console.log(`Cached ${trends.length} trends for ${geo}`)
        }

        return trends.slice(0, 25)
    } catch (error) {
        console.error('SerpApi Google Trends Error:', error)

        // Return cached data if available (even if expired)
        if (cache) {
            console.log('Returning stale cached data due to error')
            return cache.data
        }

        return []
    }
}

// Get personalized trends based on user preferences
export async function getPersonalizedTrends(
    userLocation: string = 'IN',
    userIndustry: string = 'OTHER'
): Promise<TrendingSearch[]> {
    // Map user location preference to geo code
    const geoMap: Record<string, string> = {
        'IN': 'IN',
        'US': 'US',
        'GB': 'GB',
        'GLOBAL': 'US', // Use US as global proxy
        'OTHER': 'IN',  // Default to India
    }

    const geo = geoMap[userLocation] || 'IN'
    const allTrends = await getDailyTrends(geo)

    if (userIndustry === 'OTHER' || !userIndustry) {
        // No industry filter, return all trends
        return allTrends
    }

    // Filter trends by user's industry preference
    const filteredTrends = allTrends.filter(trend => trend.industry === userIndustry)

    // If too few matches, also include OTHER category trends
    if (filteredTrends.length < 5) {
        const otherTrends = allTrends.filter(trend =>
            trend.industry === 'OTHER' || trend.industry === userIndustry
        )
        return otherTrends.slice(0, 20)
    }

    return filteredTrends.slice(0, 20)
}

// Format traffic string
export function formatTraffic(traffic: string): string {
    const num = parseInt(traffic.replace(/[^0-9]/g, ''))
    if (isNaN(num)) return traffic
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+'
    return num + '+'
}

// Industry list for UI
export const INDUSTRIES = [
    { id: 'TECH', label: 'Tech & Startups' },
    { id: 'ENTERTAINMENT', label: 'Entertainment' },
    { id: 'BUSINESS', label: 'Business & Finance' },
    { id: 'GAMING', label: 'Gaming & Esports' },
    { id: 'HEALTH', label: 'Health & Fitness' },
    { id: 'FASHION', label: 'Fashion & Lifestyle' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'FOOD', label: 'Food & Cooking' },
    { id: 'TRAVEL', label: 'Travel & Adventure' },
    { id: 'NEWS', label: 'News & Current Events' },
] as const

export type IndustryType = typeof INDUSTRIES[number]['id'] | 'OTHER'
