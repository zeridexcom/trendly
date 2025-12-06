// Real YouTube API Integration
// Fetches actual trending videos, search results, and channel data

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface YouTubeVideo {
    id: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    channelId: string
    publishedAt: string
    viewCount: number
    likeCount: number
    commentCount: number
    duration: string
    tags: string[]
    categoryId: string
    url: string
}

interface YouTubeTrendingResponse {
    videos: YouTubeVideo[]
    nextPageToken?: string
    totalResults: number
}

interface YouTubeSearchParams {
    query: string
    maxResults?: number
    order?: 'relevance' | 'date' | 'viewCount' | 'rating'
    publishedAfter?: string
    regionCode?: string
}

// Get trending videos in a region
export async function getTrendingVideos(
    regionCode: string = 'IN',
    categoryId?: string,
    maxResults: number = 20
): Promise<YouTubeTrendingResponse> {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
        throw new Error('YouTube API key not configured')
    }

    const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode,
        maxResults: maxResults.toString(),
        key: apiKey,
    })

    if (categoryId) {
        params.append('videoCategoryId', categoryId)
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch trending videos')
    }

    const data = await response.json()

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        duration: item.contentDetails.duration,
        tags: item.snippet.tags || [],
        categoryId: item.snippet.categoryId,
        url: `https://www.youtube.com/watch?v=${item.id}`,
    }))

    return {
        videos,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo.totalResults,
    }
}

// Search videos
export async function searchVideos(params: YouTubeSearchParams): Promise<YouTubeTrendingResponse> {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
        throw new Error('YouTube API key not configured')
    }

    const searchParams = new URLSearchParams({
        part: 'snippet',
        q: params.query,
        type: 'video',
        maxResults: (params.maxResults || 20).toString(),
        order: params.order || 'relevance',
        regionCode: params.regionCode || 'IN',
        key: apiKey,
    })

    if (params.publishedAfter) {
        searchParams.append('publishedAfter', params.publishedAfter)
    }

    const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`)

    if (!searchResponse.ok) {
        const error = await searchResponse.json()
        throw new Error(error.error?.message || 'Failed to search videos')
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Get detailed stats for each video
    const statsParams = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: apiKey,
    })

    const statsResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${statsParams}`)
    const statsData = await statsResponse.json()

    const videos: YouTubeVideo[] = statsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        duration: item.contentDetails.duration,
        tags: item.snippet.tags || [],
        categoryId: item.snippet.categoryId,
        url: `https://www.youtube.com/watch?v=${item.id}`,
    }))

    return {
        videos,
        nextPageToken: searchData.nextPageToken,
        totalResults: searchData.pageInfo.totalResults,
    }
}

// Get video categories
export async function getVideoCategories(regionCode: string = 'IN') {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
        throw new Error('YouTube API key not configured')
    }

    const params = new URLSearchParams({
        part: 'snippet',
        regionCode,
        key: apiKey,
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/videoCategories?${params}`)
    const data = await response.json()

    return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
    }))
}

// Calculate engagement rate
export function calculateEngagementRate(video: YouTubeVideo): number {
    if (video.viewCount === 0) return 0
    const engagements = video.likeCount + video.commentCount
    return (engagements / video.viewCount) * 100
}

// Format view count
export function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M'
    }
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
}

// Parse ISO 8601 duration to readable format
export function parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'

    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// YouTube video categories mapping
export const VIDEO_CATEGORIES = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '18': 'Short Movies',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '21': 'Videoblogging',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism',
    '30': 'Movies',
    '31': 'Anime/Animation',
    '32': 'Action/Adventure',
    '33': 'Classics',
    '34': 'Comedy',
    '35': 'Documentary',
    '36': 'Drama',
    '37': 'Family',
    '38': 'Foreign',
    '39': 'Horror',
    '40': 'Sci-Fi/Fantasy',
    '41': 'Thriller',
    '42': 'Shorts',
    '43': 'Shows',
    '44': 'Trailers',
} as const

export type YouTubeCategory = keyof typeof VIDEO_CATEGORIES
