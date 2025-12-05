import { NextResponse } from 'next/server'
import { analyzeCalendar, suggestPostTiming } from '@/lib/ai'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { action, ...data } = body

        if (action === 'analyze') {
            const { scheduledPosts, contentSlots, platforms } = data
            const insights = await analyzeCalendar({
                scheduledPosts: scheduledPosts || [],
                contentSlots: contentSlots || [],
                platforms: platforms || ['INSTAGRAM', 'TIKTOK'],
            })
            return NextResponse.json(insights)
        }

        if (action === 'suggest-timing') {
            const { platform, contentType, goal } = data
            if (!platform || !contentType || !goal) {
                return NextResponse.json(
                    { error: 'Missing required fields: platform, contentType, goal' },
                    { status: 400 }
                )
            }
            const suggestion = await suggestPostTiming(platform, contentType, goal)
            return NextResponse.json(suggestion)
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "analyze" or "suggest-timing"' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Calendar AI error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze calendar' },
            { status: 500 }
        )
    }
}
