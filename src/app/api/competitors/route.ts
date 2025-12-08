import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Retrieve tracked competitors
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const competitors = user.user_metadata?.competitors || []

        return NextResponse.json({ success: true, competitors })
    } catch (error) {
        console.error('Get competitors error:', error)
        return NextResponse.json({ error: 'Failed to get competitors' }, { status: 500 })
    }
}

// POST - Add a competitor to track
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, platform, handle, keywords } = body

        if (!name || !platform) {
            return NextResponse.json({ error: 'Name and platform required' }, { status: 400 })
        }

        const competitors = user.user_metadata?.competitors || []

        // Check limit
        if (competitors.length >= 10) {
            return NextResponse.json({ error: 'Maximum 10 competitors allowed' }, { status: 400 })
        }

        const newCompetitor = {
            id: Date.now().toString(),
            name,
            platform,
            handle: handle || '',
            keywords: keywords || [],
            createdAt: new Date().toISOString(),
            lastChecked: null,
            alerts: [],
        }

        const updatedCompetitors = [...competitors, newCompetitor]

        await supabase.auth.updateUser({
            data: { competitors: updatedCompetitors }
        })

        return NextResponse.json({ success: true, competitors: updatedCompetitors })
    } catch (error) {
        console.error('Add competitor error:', error)
        return NextResponse.json({ error: 'Failed to add competitor' }, { status: 500 })
    }
}

// DELETE - Remove a competitor
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Competitor ID required' }, { status: 400 })
        }

        const competitors = user.user_metadata?.competitors || []
        const updatedCompetitors = competitors.filter((c: any) => c.id !== id)

        await supabase.auth.updateUser({
            data: { competitors: updatedCompetitors }
        })

        return NextResponse.json({ success: true, competitors: updatedCompetitors })
    } catch (error) {
        console.error('Delete competitor error:', error)
        return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 500 })
    }
}

// PATCH - Check competitors against trends
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { trends } = body

        if (!trends || !Array.isArray(trends)) {
            return NextResponse.json({ error: 'Trends array required' }, { status: 400 })
        }

        const competitors = user.user_metadata?.competitors || []
        const alerts: any[] = []

        const updatedCompetitors = competitors.map((competitor: any) => {
            const matchingTrends: string[] = []

            // Check competitor name
            trends.forEach((trend: string) => {
                const trendLower = trend.toLowerCase()
                if (trendLower.includes(competitor.name.toLowerCase())) {
                    matchingTrends.push(trend)
                }
                // Check keywords
                competitor.keywords?.forEach((keyword: string) => {
                    if (trendLower.includes(keyword.toLowerCase())) {
                        matchingTrends.push(trend)
                    }
                })
            })

            if (matchingTrends.length > 0) {
                alerts.push({
                    competitor: competitor.name,
                    platform: competitor.platform,
                    matchingTrends: [...new Set(matchingTrends)],
                })
            }

            return {
                ...competitor,
                lastChecked: new Date().toISOString(),
                alerts: matchingTrends.length > 0 ? [...new Set(matchingTrends)] : competitor.alerts,
            }
        })

        if (alerts.length > 0) {
            await supabase.auth.updateUser({
                data: { competitors: updatedCompetitors }
            })
        }

        return NextResponse.json({
            success: true,
            alerts,
            competitors: updatedCompetitors
        })
    } catch (error) {
        console.error('Check competitors error:', error)
        return NextResponse.json({ error: 'Failed to check competitors' }, { status: 500 })
    }
}
