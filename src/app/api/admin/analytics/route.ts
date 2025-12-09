import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const range = searchParams.get('range') || '7d'

        const supabase = getSupabaseAdmin()

        // Calculate date range
        const days = range === '30d' ? 30 : range === '90d' ? 90 : 7
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

        // Get user stats
        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        const { count: newUsersToday } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

        // Get industry breakdown
        const { data: industryData } = await supabase
            .from('profiles')
            .select('industry')

        const industryBreakdown: { [key: string]: number } = {}
            ; (industryData || []).forEach((p: any) => {
                const ind = p.industry || 'OTHER'
                industryBreakdown[ind] = (industryBreakdown[ind] || 0) + 1
            })

        const industryColors: { [key: string]: string } = {
            TECH: '#3B82F6',
            HEALTH: '#22C55E',
            GAMING: '#EF4444',
            FINANCE: '#A855F7',
            ENTERTAINMENT: '#F59E0B',
            FITNESS: '#06B6D4',
            OTHER: '#6B7280'
        }

        const industryStats = Object.entries(industryBreakdown).map(([label, value]) => ({
            label,
            value,
            color: industryColors[label] || '#6B7280'
        }))

        // Mock growth data (would need time-series tracking for real data)
        const userGrowth = Array.from({ length: 7 }, (_, i) =>
            Math.floor(((totalUsers || 0) / 7) * (i + 1) + Math.random() * 20)
        )

        const searchTrends = Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 200 + 50)
        )

        const apiUsage = Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 2000 + 500)
        )

        const dailyStats = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => ({
            label,
            value: Math.floor(Math.random() * 200 + 50)
        }))

        // Mock top searches
        const topSearches = [
            { query: 'AI trends 2025', count: 456 },
            { query: 'Fitness routine', count: 321 },
            { query: 'Stock market', count: 289 },
            { query: 'Gaming setup', count: 245 },
            { query: 'Cooking recipes', count: 198 },
        ]

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: totalUsers || 0,
                newUsersToday: newUsersToday || 0,
                totalSearches: searchTrends.reduce((a, b) => a + b, 0),
                apiCalls: apiUsage[apiUsage.length - 1],
                userGrowth,
                searchTrends,
                apiUsage,
                industryBreakdown: industryStats,
                topSearches,
                dailyStats
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        })
    }
}
