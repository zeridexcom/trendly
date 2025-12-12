import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Instagram Reels Caching via Apify
 * Fetches viral reels from popular accounts and caches them
 */

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN
const APIFY_ACTOR_ID = 'apify/instagram-reel-scraper'

// Popular accounts by niche to scrape
const NICHE_ACCOUNTS: Record<string, string[]> = {
    FOOD: ['foodnetwork', 'tasty', 'buzzfeedtasty', 'gordonramsay', 'delikimochirecipes'],
    FITNESS: ['therock', 'schwarzenegger', 'kaikifit', 'chloeting', 'blogilates'],
    ENTERTAINMENT: ['netflix', 'disney', 'universalpictures', 'warnerbros', 'a24'],
    GAMING: ['playstation', 'xbox', 'nintendo', 'twitch', 'iglobal'],
    TECH: ['apple', 'samsung', 'mkbhd', 'unboxtherapy', 'techcrunch'],
    FASHION: ['voguemagazine', 'zara', 'hm', 'nike', 'adidas'],
    TRAVEL: ['natgeotravel', 'beautifuldestinations', 'cntraveler', 'lonelyplanet', 'airbnb'],
    EDUCATION: ['ted', 'natgeo', 'nasa', 'history', 'discovery'],
    BUSINESS: ['garyvee', 'gaborgenius', 'entrepreneur', 'forbes', 'businessinsider'],
    GENERAL: ['instagram', 'cristiano', 'leomessi', 'kyliejenner', 'kimkardashian'],
}

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// Calculate viral score based on engagement
function calculateViralScore(likes: number, comments: number, plays: number): number {
    if (!plays || plays === 0) return 50
    const engagementRate = ((likes + comments) / plays) * 100
    const viewBonus = Math.min(plays / 1000000 * 20, 30)
    return Math.min(Math.round(engagementRate * 5 + viewBonus + 40), 100)
}

// Run Apify actor and get results
async function runApifyActor(usernames: string[], reelsPerProfile: number = 30): Promise<any[]> {
    if (!APIFY_API_TOKEN) {
        throw new Error('APIFY_API_TOKEN environment variable not set')
    }

    // Convert usernames to profile URLs
    const directUrls = usernames.map(u => `https://www.instagram.com/${u}/reels/`)

    // Start the actor run
    const runUrl = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`

    const runResponse = await fetch(runUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            directUrls: directUrls,
            resultsLimit: reelsPerProfile * usernames.length,
        })
    })

    if (!runResponse.ok) {
        const errorText = await runResponse.text()
        throw new Error(`Failed to start Apify actor: ${runResponse.status} - ${errorText}`)
    }

    const runData = await runResponse.json()
    const runId = runData.data.id

    // Wait for run to complete (poll every 5 seconds, max 5 minutes)
    let status = 'RUNNING'
    let attempts = 0
    const maxAttempts = 60

    while (status === 'RUNNING' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000))

        const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
        const statusResponse = await fetch(statusUrl)
        const statusData = await statusResponse.json()
        status = statusData.data.status
        attempts++
    }

    if (status !== 'SUCCEEDED') {
        throw new Error(`Apify run failed with status: ${status}`)
    }

    // Get results from dataset
    const datasetUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_API_TOKEN}`
    const datasetResponse = await fetch(datasetUrl)
    const items = await datasetResponse.json()

    return items
}

// Cache reels to database
async function cacheReels(reels: any[], niche: string): Promise<number> {
    const supabase = getSupabaseAdmin()
    let cached = 0

    for (const reel of reels) {
        if (!reel.id) continue

        const viralScore = calculateViralScore(
            reel.likesCount || 0,
            reel.commentsCount || 0,
            reel.playsCount || reel.videoPlayCount || 0
        )

        const { error } = await supabase
            .from('instagram_reels_cache')
            .upsert({
                reel_id: reel.id,
                username: reel.ownerUsername || reel.username,
                display_name: reel.ownerFullName || reel.displayName,
                profile_pic: reel.profilePicUrl,
                caption: reel.caption?.slice(0, 1000),
                thumbnail: reel.displayUrl || reel.thumbnailUrl,
                video_url: reel.videoUrl,
                likes_count: reel.likesCount || 0,
                comments_count: reel.commentsCount || 0,
                plays_count: reel.playsCount || reel.videoPlayCount || 0,
                shares_count: reel.sharesCount || 0,
                audio_name: reel.musicInfo?.title,
                audio_artist: reel.musicInfo?.artist,
                hashtags: reel.hashtags || [],
                mentions: reel.mentions || [],
                duration_seconds: reel.videoDuration,
                posted_at: reel.timestamp ? new Date(reel.timestamp * 1000).toISOString() : null,
                niche: niche,
                is_active: true,
                viral_score: viralScore,
                display_order: Date.now(),
                cached_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            }, { onConflict: 'reel_id' })

        if (!error) cached++
    }

    return cached
}

// GET: Fetch cached reels
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const niche = (searchParams.get('niche') || 'GENERAL').toUpperCase()
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = (page - 1) * limit

        const supabase = getSupabaseAdmin()

        // Get reels from cache
        let query = supabase
            .from('instagram_reels_cache')
            .select('*')
            .eq('is_active', true)
            .order('viral_score', { ascending: false })
            .order('plays_count', { ascending: false })
            .range(offset, offset + limit - 1)

        if (niche !== 'ALL' && niche !== 'GENERAL') {
            query = query.eq('niche', niche)
        }

        const { data: reels, error } = await query

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        // Get total count
        let countQuery = supabase
            .from('instagram_reels_cache')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        if (niche !== 'ALL' && niche !== 'GENERAL') {
            countQuery = countQuery.eq('niche', niche)
        }

        const { count } = await countQuery

        // Format reels for frontend
        const formattedReels = (reels || []).map(r => ({
            id: r.reel_id,
            username: r.username,
            displayName: r.display_name,
            profilePic: r.profile_pic,
            caption: r.caption,
            thumbnail: r.thumbnail,
            videoUrl: r.video_url,
            likes: r.likes_count,
            comments: r.comments_count,
            plays: r.plays_count,
            shares: r.shares_count,
            audioName: r.audio_name,
            audioArtist: r.audio_artist,
            hashtags: r.hashtags,
            duration: r.duration_seconds,
            postedAt: r.posted_at,
            viralScore: r.viral_score,
            url: `https://instagram.com/reel/${r.reel_id}`
        }))

        return NextResponse.json({
            success: true,
            reels: formattedReels,
            pagination: {
                page,
                limit,
                total: count || 0,
                hasMore: (count || 0) > offset + limit
            },
            niche
        })

    } catch (error: any) {
        console.error('Instagram reels fetch error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// POST: Trigger Apify scrape and cache reels
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const niche = (body.niche || 'GENERAL').toUpperCase()
        const reelsPerProfile = body.reelsPerProfile || 30

        // Verify secret key
        if (body.key !== 'trendllly-reels-2025' && body.key !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const accounts = NICHE_ACCOUNTS[niche] || NICHE_ACCOUNTS.GENERAL
        console.log(`[Instagram Cache] Starting scrape for ${niche} with accounts:`, accounts)

        // Run Apify actor
        const reels = await runApifyActor(accounts, reelsPerProfile)
        console.log(`[Instagram Cache] Scraped ${reels.length} reels from Apify`)

        // Cache to database
        const cached = await cacheReels(reels, niche)
        console.log(`[Instagram Cache] Cached ${cached} reels for ${niche}`)

        return NextResponse.json({
            success: true,
            niche,
            scraped: reels.length,
            cached,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('[Instagram Cache] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
