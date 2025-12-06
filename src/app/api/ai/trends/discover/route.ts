import { NextRequest, NextResponse } from 'next/server'

// Types for trend discovery
interface TrendingSong {
    id: string
    title: string
    artist: string
    platform: 'tiktok' | 'instagram' | 'youtube' | 'spotify'
    uses: string
    growth: string
    audioUrl?: string
    coverUrl: string
}

interface TrendingHashtag {
    id: string
    tag: string
    platform: 'tiktok' | 'instagram' | 'twitter' | 'youtube'
    posts: string
    growth: string
    category: string
}

interface ViralClip {
    id: string
    title: string
    creator: string
    platform: 'tiktok' | 'instagram' | 'youtube'
    views: string
    likes: string
    category: string
    thumbnailUrl: string
    duration: string
}

interface TrendingTopic {
    id: string
    topic: string
    description: string
    platforms: string[]
    hotness: number // 1-100
    category: string
    region: string
}

interface DiscoveryResponse {
    lastUpdated: string
    region: string
    songs: TrendingSong[]
    hashtags: TrendingHashtag[]
    clips: ViralClip[]
    topics: TrendingTopic[]
    youtubeKeywords: string[]
}

// Mock data generator based on region and category
function generateTrendData(region: string, category: string): DiscoveryResponse {
    const now = new Date().toISOString()

    // Trending songs by platform
    const songs: TrendingSong[] = [
        {
            id: '1',
            title: 'Die With A Smile',
            artist: 'Lady Gaga & Bruno Mars',
            platform: 'tiktok',
            uses: '2.8M',
            growth: '+340%',
            coverUrl: 'https://via.placeholder.com/60x60/1DB954/fff?text=🎵'
        },
        {
            id: '2',
            title: 'APT.',
            artist: 'ROSÉ & Bruno Mars',
            platform: 'instagram',
            uses: '1.9M',
            growth: '+280%',
            coverUrl: 'https://via.placeholder.com/60x60/E1306C/fff?text=🎶'
        },
        {
            id: '3',
            title: 'Birds of a Feather',
            artist: 'Billie Eilish',
            platform: 'youtube',
            uses: '890K',
            growth: '+125%',
            coverUrl: 'https://via.placeholder.com/60x60/FF0000/fff?text=▶️'
        },
        {
            id: '4',
            title: 'please please please',
            artist: 'Sabrina Carpenter',
            platform: 'tiktok',
            uses: '3.2M',
            growth: '+420%',
            coverUrl: 'https://via.placeholder.com/60x60/000000/fff?text=🎤'
        },
        {
            id: '5',
            title: 'Espresso',
            artist: 'Sabrina Carpenter',
            platform: 'instagram',
            uses: '2.1M',
            growth: '+190%',
            coverUrl: 'https://via.placeholder.com/60x60/833AB4/fff?text=☕'
        },
        {
            id: '6',
            title: 'Not Like Us',
            artist: 'Kendrick Lamar',
            platform: 'tiktok',
            uses: '4.5M',
            growth: '+560%',
            coverUrl: 'https://via.placeholder.com/60x60/1ED760/fff?text=🔥'
        }
    ]

    // Trending hashtags
    const hashtags: TrendingHashtag[] = [
        { id: '1', tag: '#TikTokMadeMeBuyIt', platform: 'tiktok', posts: '45.2M', growth: '+89%', category: 'Shopping' },
        { id: '2', tag: '#GRWM', platform: 'instagram', posts: '32.1M', growth: '+67%', category: 'Lifestyle' },
        { id: '3', tag: '#BookTok', platform: 'tiktok', posts: '28.9M', growth: '+120%', category: 'Entertainment' },
        { id: '4', tag: '#OOTD', platform: 'instagram', posts: '410M', growth: '+23%', category: 'Fashion' },
        { id: '5', tag: '#DayInMyLife', platform: 'tiktok', posts: '18.7M', growth: '+156%', category: 'Lifestyle' },
        { id: '6', tag: '#SmallBusiness', platform: 'instagram', posts: '89.3M', growth: '+45%', category: 'Business' },
        { id: '7', tag: '#Shorts', platform: 'youtube', posts: '1.2B', growth: '+340%', category: 'Entertainment' },
        { id: '8', tag: '#Recipe', platform: 'tiktok', posts: '67.8M', growth: '+78%', category: 'Food' },
        { id: '9', tag: '#Trending', platform: 'twitter', posts: '890M', growth: '+12%', category: 'General' },
        { id: '10', tag: '#FYP', platform: 'tiktok', posts: '2.1B', growth: '+5%', category: 'General' }
    ]

    // Viral clips and reels
    const clips: ViralClip[] = [
        {
            id: '1',
            title: 'POV: You finally understood the assignment',
            creator: '@contentcreator',
            platform: 'tiktok',
            views: '24.5M',
            likes: '3.2M',
            category: 'Comedy',
            thumbnailUrl: 'https://via.placeholder.com/120x200/000/fff?text=📱',
            duration: '0:15'
        },
        {
            id: '2',
            title: 'This productivity hack changed my life',
            creator: '@hustleculture',
            platform: 'instagram',
            views: '12.8M',
            likes: '1.8M',
            category: 'Productivity',
            thumbnailUrl: 'https://via.placeholder.com/120x200/E1306C/fff?text=📈',
            duration: '0:30'
        },
        {
            id: '3',
            title: '5 AI Tools You NEED in 2024',
            creator: '@techguru',
            platform: 'youtube',
            views: '8.9M',
            likes: '450K',
            category: 'Tech',
            thumbnailUrl: 'https://via.placeholder.com/120x200/FF0000/fff?text=🤖',
            duration: '0:58'
        },
        {
            id: '4',
            title: 'Minimalist Morning Routine',
            creator: '@aestheticlife',
            platform: 'tiktok',
            views: '18.3M',
            likes: '2.4M',
            category: 'Lifestyle',
            thumbnailUrl: 'https://via.placeholder.com/120x200/000/fff?text=☀️',
            duration: '0:22'
        },
        {
            id: '5',
            title: 'Easy 15-min dinner recipe',
            creator: '@homechef',
            platform: 'instagram',
            views: '9.7M',
            likes: '1.1M',
            category: 'Food',
            thumbnailUrl: 'https://via.placeholder.com/120x200/F58529/fff?text=🍳',
            duration: '0:45'
        }
    ]

    // Trending topics
    const topics: TrendingTopic[] = [
        { id: '1', topic: 'AI in Daily Life', description: 'How people are using ChatGPT and AI tools', platforms: ['tiktok', 'youtube', 'twitter'], hotness: 98, category: 'Tech', region: 'Global' },
        { id: '2', topic: 'Quiet Luxury', description: 'Minimalist fashion and lifestyle aesthetic', platforms: ['instagram', 'tiktok'], hotness: 92, category: 'Fashion', region: 'Global' },
        { id: '3', topic: 'Dopamine Decor', description: 'Bold, colorful interior design trends', platforms: ['instagram', 'pinterest'], hotness: 87, category: 'Home', region: 'US' },
        { id: '4', topic: 'Micro-workouts', description: 'Quick 5-10 minute exercise routines', platforms: ['tiktok', 'youtube'], hotness: 85, category: 'Fitness', region: 'Global' },
        { id: '5', topic: 'Side Hustle Culture', description: 'Building income streams and passive income', platforms: ['tiktok', 'youtube', 'twitter'], hotness: 94, category: 'Business', region: 'Global' },
        { id: '6', topic: 'Romanticizing Life', description: 'Finding joy in everyday moments', platforms: ['tiktok', 'instagram'], hotness: 89, category: 'Lifestyle', region: 'Global' }
    ]

    // YouTube SEO keywords
    const youtubeKeywords: string[] = [
        'how to make money online 2024',
        'AI tools for beginners',
        'morning routine aesthetic',
        'productivity tips for students',
        'day in my life vlog',
        'healthy recipes easy',
        'workout at home no equipment',
        'study with me',
        'room makeover on a budget',
        'iPhone tips and tricks',
        'best apps 2024',
        'weight loss journey'
    ]

    // Filter by category if specified
    const filteredHashtags = category !== 'all'
        ? hashtags.filter(h => h.category.toLowerCase() === category.toLowerCase())
        : hashtags

    const filteredClips = category !== 'all'
        ? clips.filter(c => c.category.toLowerCase() === category.toLowerCase())
        : clips

    const filteredTopics = category !== 'all'
        ? topics.filter(t => t.category.toLowerCase() === category.toLowerCase())
        : topics

    return {
        lastUpdated: now,
        region,
        songs: songs,
        hashtags: filteredHashtags.length > 0 ? filteredHashtags : hashtags,
        clips: filteredClips.length > 0 ? filteredClips : clips,
        topics: filteredTopics.length > 0 ? filteredTopics : topics,
        youtubeKeywords
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'global'
    const category = searchParams.get('category') || 'all'
    const language = searchParams.get('language') || 'en'

    try {
        const data = generateTrendData(region, category)

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
        })
    } catch (error) {
        console.error('Trends Discovery Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trends' },
            { status: 500 }
        )
    }
}
