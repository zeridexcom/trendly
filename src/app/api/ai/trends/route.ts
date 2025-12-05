import { NextResponse } from 'next/server'
import { analyzeTrend, discoverTrends } from '@/lib/ai'

// Analyze a specific trend
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { action, ...data } = body

        if (action === 'analyze') {
            const { title, platform, type, description } = data
            if (!title || !platform || !type) {
                return NextResponse.json(
                    { error: 'Missing required fields: title, platform, type' },
                    { status: 400 }
                )
            }

            const analysis = await analyzeTrend({ title, platform, type, description })
            return NextResponse.json(analysis)
        }

        if (action === 'discover') {
            const { platforms, niche } = data
            const trends = await discoverTrends(platforms || ['INSTAGRAM', 'TIKTOK'], niche)
            return NextResponse.json({ trends })
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "analyze" or "discover"' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Trend analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze trend' },
            { status: 500 }
        )
    }
}
