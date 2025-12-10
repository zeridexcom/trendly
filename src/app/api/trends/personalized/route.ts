import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Curated fallback trends (only used if cache is completely empty) - Updated December 2025
const CURATED_NICHE_TRENDS: Record<string, Array<{ title: string; reason: string; contentIdea: string }>> = {
    TECH: [
        { title: 'Gemini 2.0 Flash AI', reason: 'Google latest AI model December 2025', contentIdea: 'Compare Gemini 2.0 vs ChatGPT-5 for coding tasks' },
        { title: 'ChatGPT-5 Features', reason: 'OpenAI newest model release', contentIdea: 'What ChatGPT-5 can do that 4 cant' },
        { title: 'iPhone 17 Leaks', reason: 'Apple next-gen rumors', contentIdea: 'Everything we know about iPhone 17' },
        { title: 'AI Agents 2025', reason: 'Autonomous AI agents revolution', contentIdea: 'How AI agents are changing work right now' },
        { title: 'Tech Jobs 2025', reason: 'Job market shifts with AI', contentIdea: 'Skills that will get you hired in 2025' },
        { title: 'Windows 12 Preview', reason: 'Microsoft next OS leaked features', contentIdea: 'Windows 12 features coming soon' },
        { title: 'Cybersecurity 2025', reason: 'New threats and protection', contentIdea: 'Biggest cyber threats in December 2025' },
        { title: 'Best Laptops 2025', reason: 'Holiday buying guide', contentIdea: 'Best laptops to buy this holiday season' },
        { title: 'React 19 Features', reason: 'Latest React update', contentIdea: 'New React 19 features you should use' },
        { title: 'AI Coding Tools 2025', reason: 'Developer productivity revolution', contentIdea: 'Best AI coding assistants right now' },
    ],
    HEALTH: [
        { title: 'Ozempic 2025 Update', reason: 'Weight loss medication news', contentIdea: 'New research on GLP-1 drugs in 2025' },
        { title: 'Morning Routine 2025', reason: 'New year wellness planning', contentIdea: 'Morning routines trending in 2025' },
        { title: 'Protein Myths Busted', reason: 'Nutrition science updates', contentIdea: 'How much protein you actually need in 2025' },
        { title: 'Mental Health Tech', reason: 'AI therapy apps trending', contentIdea: 'Best mental health apps in 2025' },
        { title: 'At-Home Fitness Tech', reason: 'Smart home gym equipment', contentIdea: 'Best home fitness tech for 2025' },
        { title: 'Intermittent Fasting 2025', reason: 'Updated research findings', contentIdea: 'What science says about IF in 2025' },
        { title: 'Sleep Tech 2025', reason: 'Advanced sleep tracking', contentIdea: 'Best sleep gadgets of 2025' },
        { title: 'Supplement Trends 2025', reason: 'New supplements going viral', contentIdea: 'Supplements actually worth taking' },
        { title: 'Zone 2 Training', reason: 'Peter Attia longevity method', contentIdea: 'Why everyone is doing Zone 2 cardio' },
        { title: 'Cold Plunge Benefits', reason: 'Cold exposure trending', contentIdea: 'Ice bath benefits backed by science' },
    ],
    ENTERTAINMENT: [
        { title: 'Pushpa 2 Records', reason: 'Biggest Indian movie 2025', contentIdea: 'How Pushpa 2 broke all records' },
        { title: 'Squid Game S2 Reactions', reason: 'Netflix biggest show 2025', contentIdea: 'Squid Game Season 2 ending explained' },
        { title: 'Spotify Wrapped 2025', reason: 'Annual music recap season', contentIdea: 'What your Wrapped says about you' },
        { title: 'GTA 6 Trailer 2', reason: 'Most anticipated game reveal', contentIdea: 'Everything in the new GTA 6 trailer' },
        { title: 'Year End Music', reason: 'Top songs of 2025', contentIdea: 'Best songs you missed in 2025' },
    ],
    GAMING: [
        { title: 'GTA 6 Updates', reason: 'Most anticipated game 2025', contentIdea: 'Latest GTA 6 news and release info' },
        { title: 'Game Awards 2025', reason: 'Gaming biggest night', contentIdea: 'Best announcements from Game Awards' },
        { title: 'BGMI December Update', reason: 'New season content', contentIdea: 'Best loadout for new BGMI season' },
        { title: 'PS5 New Games 2025', reason: 'Holiday game releases', contentIdea: 'Must-play PS5 games this December' },
        { title: 'Gaming Gifts 2025', reason: 'Holiday gift guides', contentIdea: 'Best gaming gifts under 5000' },
    ],
    BUSINESS: [
        { title: 'AI Startups 2025', reason: 'Funding trends shifting to AI', contentIdea: 'Hottest AI startups to watch' },
        { title: 'Remote Work 2025', reason: 'Hybrid work evolution', contentIdea: 'Remote work trends for 2025' },
        { title: 'AI Business Tools', reason: 'Enterprise AI adoption', contentIdea: 'AI tools every business should use' },
        { title: 'Market Outlook 2026', reason: 'Year-end predictions', contentIdea: 'Where to invest in 2026' },
        { title: 'Side Hustles 2025', reason: 'Income diversification', contentIdea: 'Best side hustles starting 2025' },
    ],
    FASHION: [
        { title: 'Winter Fashion 2025', reason: 'Cold weather style trends', contentIdea: 'Warmest stylish outfits for December' },
        { title: 'Sustainable Fashion 2025', reason: 'Eco-conscious trend growing', contentIdea: 'Best sustainable brands to shop' },
        { title: 'Thrift Finds December', reason: 'Budget fashion trending', contentIdea: 'Best thrift haul of December' },
        { title: 'Capsule Wardrobe 2025', reason: 'Minimalist fashion', contentIdea: '2025 capsule wardrobe essentials' },
        { title: 'Holiday Party Outfits', reason: 'Party season fashion', contentIdea: 'What to wear to holiday parties' },
    ],
    FOOD: [
        { title: 'Viral Recipes 2025', reason: 'TikTok food trends', contentIdea: 'Best viral recipes of December' },
        { title: 'Meal Prep 2025', reason: 'New year health prep', contentIdea: 'Healthy meal prep for January' },
        { title: 'Street Food India', reason: 'Local food exploration', contentIdea: 'Best street food spots December' },
        { title: 'Christmas Recipes 2025', reason: 'Holiday cooking', contentIdea: 'Easy Christmas desserts to try' },
        { title: 'Air Fryer Hacks 2025', reason: 'Kitchen gadget trending', contentIdea: 'New air fryer recipes for winter' },
    ],
    EDUCATION: [
        { title: 'JEE 2025 Prep', reason: 'Exam season preparation', contentIdea: 'JEE 2025 last month revision tips' },
        { title: 'Study Goals 2025', reason: 'New year study planning', contentIdea: 'How to study better in 2025' },
        { title: 'Career Trends 2025', reason: 'Job market changing', contentIdea: 'Careers that will boom in 2025' },
        { title: 'Free Courses 2025', reason: 'Upskilling demand', contentIdea: 'Best free courses to take in 2025' },
        { title: 'AI in Education', reason: 'EdTech revolution', contentIdea: 'How AI is changing learning' },
    ],
    TRAVEL: [
        { title: 'New Year Travel 2025', reason: 'NYE trip planning', contentIdea: 'Best NYE destinations from India' },
        { title: 'Budget Travel 2025', reason: 'Affordable getaways', contentIdea: 'Cheap travel hacks for 2025' },
        { title: 'Solo Travel 2025', reason: 'Solo travel growing', contentIdea: 'Best solo travel destinations 2025' },
        { title: 'Flight Deals December', reason: 'Holiday travel deals', contentIdea: 'How to find cheap December flights' },
        { title: 'Winter Destinations', reason: 'Cold weather travel', contentIdea: 'Best snow destinations in India' },
    ],
    FITNESS: [
        { title: 'Fitness Goals 2025', reason: 'New year resolution prep', contentIdea: 'How to set realistic fitness goals' },
        { title: 'Gym Guide 2025', reason: 'New members incoming', contentIdea: 'Complete gym beginner guide 2025' },
        { title: 'Yoga Trends 2025', reason: 'Holistic fitness growing', contentIdea: 'Yoga styles trending in 2025' },
        { title: 'Running in Winter', reason: 'Cold weather fitness', contentIdea: 'How to run safely in winter' },
        { title: 'Strength Training 2025', reason: 'Weight training for all', contentIdea: 'Strength training myths busted' },
    ],
    FINANCE: [
        { title: 'Stocks 2025 Outlook', reason: 'Year-end investment planning', contentIdea: 'Best stocks to watch in 2025' },
        { title: 'Mutual Funds 2025', reason: 'SIP investment trending', contentIdea: 'Best mutual funds for 2025' },
        { title: 'Tax Planning 2025', reason: 'Financial year planning', contentIdea: 'Tax saving tips before March' },
        { title: 'Crypto 2025', reason: 'Bitcoin ATH updates', contentIdea: 'Is crypto worth buying now?' },
        { title: 'Budget Tips 2025', reason: 'New year money goals', contentIdea: 'How to budget for 2025' },
    ],
}

// Get Supabase client for reading cache
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Allow override via query params (for unauthenticated users)
        let location = searchParams.get('geo') || 'IN'
        let industry = searchParams.get('industry') || null

        // Try to get user preferences if authenticated
        try {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.user_metadata) {
                location = user.user_metadata.location || location
                industry = user.user_metadata.industry || industry
            }
        } catch {
            // Not authenticated, use query params
        }

        // ============ READ FROM SUPABASE CACHE (NO EXTERNAL API CALLS) ============
        const supabaseAdmin = getSupabaseAdmin()

        // Get cached trends from database
        const { data: cachedTrends, error: trendsError } = await supabaseAdmin
            .from('cached_google_trends')
            .select('*')
            .order('id', { ascending: true })

        let trends: any[] = []
        let fromCache = false
        let cacheInfo: { lastRefresh: string | null; count: number } = { lastRefresh: null, count: 0 }

        if (cachedTrends && cachedTrends.length > 0) {
            // Use cached trends
            trends = cachedTrends.map((t: any) => ({
                title: t.title,
                formattedTraffic: t.formatted_traffic || t.traffic || 'Trending',
                relatedQueries: t.related_queries || [],
                industry: t.industry,
                relevanceScore: t.relevance_score || 90,
                reason: t.reason,
                contentIdea: t.content_idea,
                source: 'Cached Google Trends',
            }))
            fromCache = true
            cacheInfo.lastRefresh = cachedTrends[0]?.fetched_at
            cacheInfo.count = trends.length
        }

        // If user has an industry, add curated niche trends
        if (industry && industry !== 'ALL' && industry !== 'OTHER') {
            const curated = CURATED_NICHE_TRENDS[industry] || []
            const curatedTrends = curated.map((t) => ({
                title: t.title,
                formattedTraffic: 'Hot Topic',
                relevanceScore: 95,
                reason: t.reason,
                contentIdea: t.contentIdea,
                source: 'Curated for ' + industry,
                quickAnalysis: {
                    whyTrending: t.reason,
                    contentIdea: t.contentIdea,
                    isPreComputed: true
                }
            }))

            // Add curated that aren't already in trends (avoid duplicates)
            const existingTitles = new Set(trends.map((t: any) => t.title.toLowerCase()))
            const newCurated = curatedTrends.filter(t => !existingTitles.has(t.title.toLowerCase()))

            // Put curated first (most relevant), then cached
            trends = [...newCurated, ...trends]
        }

        // FALLBACK: If no cached trends at all, use curated only
        if (trends.length === 0 && industry && CURATED_NICHE_TRENDS[industry]) {
            trends = CURATED_NICHE_TRENDS[industry].map((t) => ({
                title: t.title,
                formattedTraffic: 'Hot Topic',
                relevanceScore: 95,
                reason: t.reason,
                contentIdea: t.contentIdea,
                source: 'Curated',
                quickAnalysis: {
                    whyTrending: t.reason,
                    contentIdea: t.contentIdea,
                    isPreComputed: true
                }
            }))
        }

        return NextResponse.json({
            success: true,
            trends,
            personalization: {
                location,
                industry: industry || 'ALL',
                fromCache,
                cacheInfo,
                totalCount: trends.length,
            }
        })
    } catch (error) {
        console.error('Personalized trends error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trends' },
            { status: 500 }
        )
    }
}
