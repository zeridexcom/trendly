import { NextRequest, NextResponse } from 'next/server'
import { getKeyStatuses, searchYouTube } from '@/lib/youtube-key-manager'

// GET - Get key statuses for admin dashboard
export async function GET(req: NextRequest) {
    try {
        const status = getKeyStatuses()

        return NextResponse.json({
            success: true,
            ...status
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// POST - Test a YouTube search to verify keys work
export async function POST(req: NextRequest) {
    try {
        const { query = 'test' } = await req.json()

        console.log(`[YouTube Test] Testing search with query: "${query}"`)

        const startTime = Date.now()
        const result = await searchYouTube(query, 5)
        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            message: 'YouTube API working!',
            duration: `${duration}ms`,
            resultsCount: result?.items?.length || 0,
            sample: result?.items?.slice(0, 2).map((item: any) => ({
                title: item.snippet?.title,
                channel: item.snippet?.channelTitle
            }))
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
