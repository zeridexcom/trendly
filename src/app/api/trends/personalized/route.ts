import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Curated fallback trends (only used if cache is completely empty)
const CURATED_NICHE_TRENDS: Record<string, Array<{ title: string; reason: string; contentIdea: string }>> = {
    TECH: [
        { title: 'Gemini 2.0 Flash AI', reason: 'Google latest AI model release', contentIdea: 'Compare Gemini 2.0 vs ChatGPT for coding tasks' },
        { title: 'ChatGPT vs Claude', reason: 'AI comparison always trending', contentIdea: 'Which AI is best for different use cases?' },
        { title: 'iPhone 16 Pro Tips', reason: 'Latest iPhone features', contentIdea: 'Hidden features most users dont know' },
        { title: 'AI Agents Revolution', reason: 'Autonomous AI agents are the future', contentIdea: 'How AI agents will change work in 2025' },
        { title: 'Tech Layoffs 2024', reason: 'Ongoing industry restructuring', contentIdea: 'Skills that make you layoff-proof' },
        { title: 'Windows 11 Updates', reason: 'OS updates and features', contentIdea: 'New Windows features you should try' },
        { title: 'Cybersecurity Tips', reason: 'Growing hack threats', contentIdea: 'Protect your accounts in 2025' },
        { title: 'Best Laptops 2024', reason: 'Buying guide demand', contentIdea: 'MacBook vs Windows for creators' },
        { title: 'React vs Next.js', reason: 'Web dev framework debate', contentIdea: 'Which framework should you learn?' },
        { title: 'Python for Beginners', reason: 'Programming learning surge', contentIdea: 'Learn Python in 30 days roadmap' },
    ],
    HEALTH: [
        { title: 'Ozempic Weight Loss', reason: 'Trending weight loss medication', contentIdea: 'What doctors wish you knew about GLP-1 drugs' },
        { title: 'Morning Routine Hacks', reason: 'Always popular wellness topic', contentIdea: '5 AM routine that changed my energy levels' },
        { title: 'Protein Intake Guide', reason: 'Fitness nutrition basics', contentIdea: 'How much protein you actually need' },
        { title: 'Mental Health Awareness', reason: 'Growing focus on wellness', contentIdea: 'Signs of burnout and how to recover' },
        { title: 'Home Workout Trends', reason: 'Post-pandemic fitness shift', contentIdea: 'No-equipment full body workout' },
        { title: 'Intermittent Fasting 2024', reason: 'Popular diet method', contentIdea: 'My 30-day intermittent fasting results' },
        { title: 'Sleep Optimization Tips', reason: 'Sleep quality awareness rising', contentIdea: 'Sleep hacks that actually work' },
        { title: 'Creatine Benefits', reason: 'Supplement research trending', contentIdea: 'Why creatine is not just for gym bros' },
        { title: 'Walking for Weight Loss', reason: 'Low-impact exercise trend', contentIdea: '10K steps challenge - what happens?' },
        { title: 'Gut Health Diet', reason: 'Microbiome awareness growing', contentIdea: 'Foods that improve gut health fast' },
    ],
    ENTERTAINMENT: [
        { title: 'Pushpa 2 Box Office', reason: 'Biggest Indian movie release', contentIdea: 'Why Pushpa 2 is breaking records' },
        { title: 'Squid Game Season 2', reason: 'Netflix biggest show return', contentIdea: 'Everything to know before Season 2' },
        { title: 'Spotify Wrapped 2024', reason: 'Annual music trends reveal', contentIdea: 'What your Wrapped says about you' },
        { title: 'Award Season Predictions', reason: 'Oscar/Golden Globe buzz', contentIdea: 'Movies likely to win this year' },
        { title: 'K-Pop 2024 Moments', reason: 'Global music phenomenon', contentIdea: 'Biggest K-Pop moments of the year' },
    ],
    GAMING: [
        { title: 'GTA 6 Release Date', reason: 'Most anticipated game ever', contentIdea: 'Everything we know about GTA 6' },
        { title: 'Game Awards 2024', reason: 'Gaming biggest night', contentIdea: 'Winners and biggest announcements' },
        { title: 'BGMI Season Updates', reason: 'Popular mobile game in India', contentIdea: 'Best loadout for new season' },
        { title: 'PS5 Pro Performance', reason: 'New console release', contentIdea: 'Is PS5 Pro worth the upgrade?' },
        { title: 'Gaming Setup 2025', reason: 'Always trending topic', contentIdea: 'Budget gaming setup under 50K' },
    ],
    BUSINESS: [
        { title: 'Startup Funding Winter', reason: 'Investment market trends', contentIdea: 'How startups are surviving the funding crunch' },
        { title: 'Remote Work Debate', reason: 'Return to office vs WFH', contentIdea: 'Productivity secrets of remote workers' },
        { title: 'AI in Business 2025', reason: 'Enterprise AI adoption', contentIdea: 'How to use AI without replacing jobs' },
        { title: 'Stock Market Outlook', reason: 'Investment planning', contentIdea: 'Sectors to watch in 2025' },
        { title: 'Side Hustle Ideas', reason: 'Income diversification', contentIdea: 'Profitable side hustles that actually work' },
    ],
    FASHION: [
        { title: 'Winter Fashion 2024', reason: 'Seasonal style trends', contentIdea: 'Cozy outfits that still look chic' },
        { title: 'Sustainable Fashion', reason: 'Eco-conscious trend', contentIdea: 'Building an eco-friendly wardrobe' },
        { title: 'Thrift Shopping Tips', reason: 'Budget fashion growing', contentIdea: 'Hidden gems at thrift stores' },
        { title: 'Minimalist Wardrobe', reason: 'Capsule wardrobe trend', contentIdea: '10 pieces that create 30 outfits' },
        { title: 'Wedding Guest Outfits', reason: 'Wedding season content', contentIdea: 'What to wear for different types of weddings' },
    ],
    FOOD: [
        { title: 'Viral Food Recipes', reason: 'Social media food trends', contentIdea: 'Testing viral TikTok recipes' },
        { title: 'Healthy Meal Prep', reason: 'Wellness + cooking combo', contentIdea: 'Sunday meal prep for busy weeks' },
        { title: 'Street Food Tours', reason: 'Foodie exploration content', contentIdea: 'Best street food under Rs 50' },
        { title: 'Christmas Recipes', reason: 'Holiday season cooking', contentIdea: 'Easy Christmas desserts to impress' },
        { title: 'Air Fryer Recipes', reason: 'Kitchen gadget trending', contentIdea: 'Things you didnt know you could air fry' },
    ],
    EDUCATION: [
        { title: 'JEE/NEET Preparation', reason: 'Exam season in India', contentIdea: 'Last minute revision strategies' },
        { title: 'Study With Me', reason: 'Popular study content format', contentIdea: 'Pomodoro study session for focus' },
        { title: 'Career After 12th', reason: 'Guidance content demand', contentIdea: 'Non-traditional careers nobody talks about' },
        { title: 'Free Online Courses', reason: 'Skill development trend', contentIdea: 'Best free courses to learn in 2025' },
        { title: 'Board Exam Tips', reason: 'Academic guidance needed', contentIdea: 'How toppers study differently' },
    ],
    TRAVEL: [
        { title: 'Winter Travel Destinations', reason: 'Seasonal travel planning', contentIdea: 'Best places to visit in December' },
        { title: 'Budget Travel Tips', reason: 'Affordable travel demand', contentIdea: 'How I traveled for Rs 500/day' },
        { title: 'Solo Travel Safety', reason: 'Growing solo travel trend', contentIdea: 'Safety tips for solo female travelers' },
        { title: 'Flight Booking Hacks', reason: 'Travel savings tips', contentIdea: 'When to book for cheapest flights' },
        { title: 'Hidden Gems India', reason: 'Off-beat destination content', contentIdea: 'Places that should be on your list' },
    ],
    FITNESS: [
        { title: 'Home Workout Routine', reason: 'No-gym fitness trend', contentIdea: '30-day home workout challenge' },
        { title: 'Gym Beginner Guide', reason: 'New year fitness goals', contentIdea: 'First week at the gym - what to do' },
        { title: 'Yoga for Flexibility', reason: 'Mind-body wellness', contentIdea: '15 minute morning yoga flow' },
        { title: 'Running Tips 2024', reason: 'Cardio fitness basics', contentIdea: 'How to run your first 5K' },
        { title: 'Weight Training Women', reason: 'Breaking fitness myths', contentIdea: 'Strength training wont make you bulky' },
    ],
    FINANCE: [
        { title: 'Stock Market Tips', reason: 'Investment interest growing', contentIdea: 'Best stocks to watch in 2025' },
        { title: 'Mutual Funds India', reason: 'SIP investing popular', contentIdea: 'Best mutual funds for beginners' },
        { title: 'Tax Saving Tips', reason: 'Financial planning season', contentIdea: 'Save tax legally in 2024-25' },
        { title: 'Crypto Update 2024', reason: 'Digital currency trends', contentIdea: 'Is crypto worth it in 2025?' },
        { title: 'Personal Finance Basics', reason: 'Financial literacy demand', contentIdea: 'Managing money in your 20s' },
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
