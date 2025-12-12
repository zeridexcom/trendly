import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin endpoint to manually import Apify results
 * POST with JSON array of reels from Apify
 */

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// Extract reel ID from Instagram URL
function extractReelId(url: string): string | null {
    const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
    return match ? match[2] : null
}

export async function POST(request: NextRequest) {
    try {
        const { reels, niche = 'GENERAL', key } = await request.json()

        // Verify key
        if (key !== 'trendllly-import-2025') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!Array.isArray(reels)) {
            return NextResponse.json({ error: 'reels must be an array' }, { status: 400 })
        }

        const supabase = getSupabaseAdmin()
        let imported = 0

        for (const reel of reels) {
            const reelId = extractReelId(reel.url)
            if (!reelId) continue

            const likesCount = reel.likesCount || 0
            const commentsCount = reel.commentsCount || 0

            const viralScore = Math.min(
                Math.round(
                    (likesCount / 1000) * 2 +
                    (commentsCount / 100) * 5 +
                    40
                ),
                100
            )

            const { error } = await supabase
                .from('instagram_reels_cache')
                .upsert({
                    reel_id: reelId,
                    username: reel.ownerUsername,
                    display_name: reel.ownerFullName,
                    caption: reel.caption?.slice(0, 1000),
                    thumbnail: reel.displayUrl,
                    likes_count: likesCount,
                    comments_count: commentsCount,
                    plays_count: likesCount * 10,
                    niche: niche.toUpperCase(),
                    is_active: true,
                    viral_score: viralScore,
                    display_order: Date.now(),
                    posted_at: reel.timestamp || null,
                    cached_at: new Date().toISOString(),
                    last_updated: new Date().toISOString()
                }, { onConflict: 'reel_id' })

            if (!error) imported++
        }

        return NextResponse.json({
            success: true,
            imported,
            total: reels.length,
            niche
        })

    } catch (error: any) {
        console.error('Import error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
