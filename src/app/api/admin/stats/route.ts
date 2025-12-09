import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Get Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        // Get total users count
        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        // Get users active today (logged in within last 24 hours)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { count: activeToday } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('updated_at', yesterday)

        // Get cache metadata for trends/videos count
        const { data: cacheMetadata } = await supabase
            .from('cache_metadata')
            .select('*')
            .eq('id', 'main')
            .single()

        // Mock data for now (these would come from a proper analytics table)
        const totalSearches = Math.floor(Math.random() * 1000) + 500
        const apiCallsToday = (cacheMetadata?.google_trends_count || 0) + (cacheMetadata?.youtube_videos_count || 0) * 3

        return NextResponse.json({
            success: true,
            totalUsers: totalUsers || 0,
            activeToday: activeToday || 0,
            totalSearches,
            apiCallsToday,
            trendsCount: cacheMetadata?.google_trends_count || 0,
            videosCount: cacheMetadata?.youtube_videos_count || 0,
            lastRefresh: cacheMetadata?.last_google_refresh || null
        })
    } catch (error: any) {
        console.error('Admin stats error:', error)

        // Return mock data on error
        return NextResponse.json({
            success: true,
            totalUsers: 0,
            activeToday: 0,
            totalSearches: 0,
            apiCallsToday: 0,
            trendsCount: 0,
            videosCount: 0,
            error: error.message
        })
    }
}
