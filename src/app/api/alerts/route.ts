import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Retrieve custom keyword alerts
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const alerts = user.user_metadata?.keywordAlerts || []

        return NextResponse.json({ success: true, alerts })
    } catch (error) {
        console.error('Get alerts error:', error)
        return NextResponse.json({ error: 'Failed to get alerts' }, { status: 500 })
    }
}

// POST - Add a keyword alert
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { keyword } = body

        if (!keyword || keyword.trim().length < 2) {
            return NextResponse.json({ error: 'Keyword must be at least 2 characters' }, { status: 400 })
        }

        const alerts = user.user_metadata?.keywordAlerts || []

        // Check if already exists
        if (alerts.some((a: any) => a.keyword.toLowerCase() === keyword.toLowerCase())) {
            return NextResponse.json({ error: 'Keyword alert already exists' }, { status: 400 })
        }

        // Add new alert (max 20)
        const newAlert = {
            id: Date.now().toString(),
            keyword: keyword.trim(),
            createdAt: new Date().toISOString(),
            matchCount: 0,
            lastMatch: null,
        }

        const updatedAlerts = [newAlert, ...alerts].slice(0, 20)

        await supabase.auth.updateUser({
            data: { keywordAlerts: updatedAlerts }
        })

        return NextResponse.json({ success: true, alerts: updatedAlerts })
    } catch (error) {
        console.error('Add alert error:', error)
        return NextResponse.json({ error: 'Failed to add alert' }, { status: 500 })
    }
}

// DELETE - Remove a keyword alert
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
            return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
        }

        const alerts = user.user_metadata?.keywordAlerts || []
        const updatedAlerts = alerts.filter((a: any) => a.id !== id)

        await supabase.auth.updateUser({
            data: { keywordAlerts: updatedAlerts }
        })

        return NextResponse.json({ success: true, alerts: updatedAlerts })
    } catch (error) {
        console.error('Delete alert error:', error)
        return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
    }
}

// PATCH - Check alerts against current trends
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { trends } = body // Array of trend titles

        if (!trends || !Array.isArray(trends)) {
            return NextResponse.json({ error: 'Trends array required' }, { status: 400 })
        }

        const alerts = user.user_metadata?.keywordAlerts || []
        const matches: any[] = []

        const updatedAlerts = alerts.map((alert: any) => {
            const matchingTrends = trends.filter((t: string) =>
                t.toLowerCase().includes(alert.keyword.toLowerCase())
            )

            if (matchingTrends.length > 0) {
                matches.push({
                    keyword: alert.keyword,
                    matchingTrends,
                })
                return {
                    ...alert,
                    matchCount: alert.matchCount + matchingTrends.length,
                    lastMatch: new Date().toISOString(),
                }
            }
            return alert
        })

        if (matches.length > 0) {
            await supabase.auth.updateUser({
                data: { keywordAlerts: updatedAlerts }
            })
        }

        return NextResponse.json({
            success: true,
            matches,
            alerts: updatedAlerts
        })
    } catch (error) {
        console.error('Check alerts error:', error)
        return NextResponse.json({ error: 'Failed to check alerts' }, { status: 500 })
    }
}
