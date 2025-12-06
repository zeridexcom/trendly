import { NextRequest, NextResponse } from 'next/server'

// Types
interface SocialProfile {
    platform: string
    username: string
    url: string
    followers: number
    following: number
    posts: number
    avgEngagement: number
    growth: number // % growth last 30 days
}

interface TopContent {
    id: string
    platform: string
    type: 'post' | 'video' | 'reel' | 'story'
    title: string
    engagement: number
    views?: number
    likes: number
    comments: number
    date: string
}

interface Competitor {
    id: string
    name: string
    description: string
    website: string
    logoUrl: string
    profiles: SocialProfile[]
    topContent: TopContent[]
    postingFrequency: {
        daily: number
        weekly: number
        monthly: number
    }
    addedAt: string
    lastAnalyzed: string
}

// In-memory store (production would use database)
let competitors: Competitor[] = []

// Generate mock analytics for a competitor
function generateMockAnalytics(name: string, profiles: { platform: string; username: string; url: string }[]): Competitor {
    const socialProfiles: SocialProfile[] = profiles.map(p => {
        const baseFollowers = Math.floor(Math.random() * 500000) + 10000
        return {
            platform: p.platform,
            username: p.username,
            url: p.url,
            followers: baseFollowers,
            following: Math.floor(baseFollowers * 0.1),
            posts: Math.floor(Math.random() * 2000) + 100,
            avgEngagement: Math.floor(Math.random() * 8) + 1, // 1-9%
            growth: Math.floor(Math.random() * 20) - 5, // -5 to +15%
        }
    })

    const platforms = profiles.map(p => p.platform)
    const topContent: TopContent[] = [
        {
            id: '1',
            platform: platforms[0] || 'instagram',
            type: 'reel',
            title: 'How we grew 10x in 6 months',
            engagement: 12.5,
            views: 245000,
            likes: 18500,
            comments: 892,
            date: '2024-12-01',
        },
        {
            id: '2',
            platform: platforms[1] || 'youtube',
            type: 'video',
            title: 'Day in the Life of Our Team',
            engagement: 8.2,
            views: 89000,
            likes: 4200,
            comments: 312,
            date: '2024-11-28',
        },
        {
            id: '3',
            platform: platforms[0] || 'instagram',
            type: 'post',
            title: 'Big announcement coming soon...',
            engagement: 15.8,
            likes: 32100,
            comments: 1245,
            date: '2024-11-25',
        },
        {
            id: '4',
            platform: 'tiktok',
            type: 'video',
            title: 'POV: Working at a startup',
            engagement: 22.1,
            views: 1200000,
            likes: 89000,
            comments: 4521,
            date: '2024-11-20',
        },
        {
            id: '5',
            platform: 'twitter',
            type: 'post',
            title: 'Thread: 10 lessons from building our product',
            engagement: 6.4,
            likes: 2800,
            comments: 156,
            date: '2024-11-18',
        },
    ]

    return {
        id: `comp_${Date.now()}`,
        name,
        description: `Competitor profile for ${name}`,
        website: profiles.find(p => p.platform === 'website')?.url || '',
        logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
        profiles: socialProfiles,
        topContent: topContent.filter(c => platforms.includes(c.platform) || platforms.length === 0).slice(0, 5),
        postingFrequency: {
            daily: Math.floor(Math.random() * 5) + 1,
            weekly: Math.floor(Math.random() * 20) + 5,
            monthly: Math.floor(Math.random() * 60) + 20,
        },
        addedAt: new Date().toISOString(),
        lastAnalyzed: new Date().toISOString(),
    }
}

// GET - Fetch all competitors
export async function GET() {
    // Calculate aggregate stats
    const totalFollowers = competitors.reduce((sum, c) =>
        sum + c.profiles.reduce((pSum, p) => pSum + p.followers, 0), 0
    )
    const avgEngagement = competitors.length > 0
        ? competitors.reduce((sum, c) =>
            sum + c.profiles.reduce((pSum, p) => pSum + p.avgEngagement, 0) / c.profiles.length, 0
        ) / competitors.length
        : 0

    return NextResponse.json({
        competitors,
        stats: {
            total: competitors.length,
            totalFollowers,
            avgEngagement: avgEngagement.toFixed(1),
            mostActive: competitors.sort((a, b) => b.postingFrequency.weekly - a.postingFrequency.weekly)[0]?.name || null
        }
    })
}

// POST - Add new competitor
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.name) {
            return NextResponse.json({ error: 'Competitor name is required' }, { status: 400 })
        }

        const profiles = body.profiles || []
        const competitor = generateMockAnalytics(body.name, profiles)
        competitor.description = body.description || competitor.description

        competitors.push(competitor)

        return NextResponse.json({
            success: true,
            competitor,
            message: `Added ${body.name} with ${profiles.length} social profiles`
        })
    } catch (error) {
        console.error('Competitors API Error:', error)
        return NextResponse.json({ error: 'Failed to add competitor' }, { status: 500 })
    }
}

// PUT - Update competitor
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const index = competitors.findIndex(c => c.id === body.id)

        if (index === -1) {
            return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
        }

        // Re-generate analytics with updated profiles
        if (body.profiles) {
            const updated = generateMockAnalytics(body.name || competitors[index].name, body.profiles)
            updated.id = body.id
            updated.addedAt = competitors[index].addedAt
            competitors[index] = updated
        } else {
            competitors[index] = { ...competitors[index], ...body }
        }

        return NextResponse.json({ success: true, competitor: competitors[index] })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update competitor' }, { status: 500 })
    }
}

// DELETE - Remove competitor
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Competitor ID required' }, { status: 400 })
    }

    competitors = competitors.filter(c => c.id !== id)

    return NextResponse.json({ success: true })
}
