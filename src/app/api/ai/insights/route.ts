import { NextResponse } from 'next/server'
import { generateDailyInsights } from '@/lib/ai'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { activeTrends, ideasInPipeline, scheduledPosts, publishedThisWeek, topPlatforms } = body

        const insights = await generateDailyInsights({
            activeTrends: activeTrends || 0,
            ideasInPipeline: ideasInPipeline || 0,
            scheduledPosts: scheduledPosts || 0,
            publishedThisWeek: publishedThisWeek || 0,
            topPlatforms: topPlatforms || ['INSTAGRAM', 'TIKTOK'],
        })

        return NextResponse.json(insights)
    } catch (error) {
        console.error('Dashboard insights error:', error)
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        )
    }
}
