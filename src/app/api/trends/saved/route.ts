import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Retrieve saved trends
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get saved trends from user metadata
        const savedTrends = user.user_metadata?.savedTrends || []

        return NextResponse.json({
            success: true,
            trends: savedTrends
        })
    } catch (error) {
        console.error('Get saved trends error:', error)
        return NextResponse.json({ error: 'Failed to get saved trends' }, { status: 500 })
    }
}

// POST - Save a trend
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { trend } = body

        if (!trend || !trend.title) {
            return NextResponse.json({ error: 'Trend data required' }, { status: 400 })
        }

        // Get existing saved trends
        const savedTrends = user.user_metadata?.savedTrends || []

        // Check if already saved
        const alreadySaved = savedTrends.some((t: any) => t.title === trend.title)
        if (alreadySaved) {
            return NextResponse.json({ error: 'Trend already saved' }, { status: 400 })
        }

        // Add new trend with timestamp
        const newTrend = {
            ...trend,
            savedAt: new Date().toISOString(),
        }

        const updatedTrends = [newTrend, ...savedTrends].slice(0, 50) // Max 50 saved trends

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
            data: { savedTrends: updatedTrends }
        })

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({
            success: true,
            message: 'Trend saved',
            trends: updatedTrends
        })
    } catch (error) {
        console.error('Save trend error:', error)
        return NextResponse.json({ error: 'Failed to save trend' }, { status: 500 })
    }
}

// DELETE - Remove a saved trend
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title')

        if (!title) {
            return NextResponse.json({ error: 'Trend title required' }, { status: 400 })
        }

        // Get existing saved trends
        const savedTrends = user.user_metadata?.savedTrends || []

        // Remove the trend
        const updatedTrends = savedTrends.filter((t: any) => t.title !== title)

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
            data: { savedTrends: updatedTrends }
        })

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({
            success: true,
            message: 'Trend removed',
            trends: updatedTrends
        })
    } catch (error) {
        console.error('Delete trend error:', error)
        return NextResponse.json({ error: 'Failed to delete trend' }, { status: 500 })
    }
}
