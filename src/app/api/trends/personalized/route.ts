import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends } from '@/lib/google-trends'
import { createClient } from '@/lib/supabase/server'
import { filterTrendsByRelevance, generateNicheTrends } from '@/lib/ai'

// Curated evergreen + current trends for each industry (FALLBACK - never fails)
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
        { title: 'Yoga for Beginners', reason: 'Mind-body fitness popular', contentIdea: '15 minute yoga routine for busy people' },
        { title: 'PCOS Diet Plan', reason: 'Womens health awareness', contentIdea: 'What to eat with PCOS - complete guide' },
        { title: 'Cold Plunge Benefits', reason: 'Cold therapy trending', contentIdea: 'I tried cold showers for 30 days' },
        { title: 'Healthy Meal Prep Ideas', reason: 'Nutrition planning demand', contentIdea: 'Sunday meal prep for the whole week' },
        { title: 'Weight Training for Women', reason: 'Strength training awareness', contentIdea: 'Why women should lift weights' },
        { title: 'Diabetes Prevention Tips', reason: 'Health prevention focus', contentIdea: 'Simple habits to prevent Type 2 diabetes' },
        { title: 'Stress Relief Techniques', reason: 'Mental wellness priority', contentIdea: '5 minute stress relief that works' },
        { title: 'Running for Beginners', reason: 'Cardio fitness basics', contentIdea: 'Couch to 5K complete guide' },
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
    NEWS: [
        { title: 'Year End Review 2024', reason: 'Annual news roundup', contentIdea: 'Biggest news stories of 2024' },
        { title: 'Election Analysis', reason: 'Political coverage', contentIdea: 'What the results mean for you' },
        { title: 'Economic Outlook 2025', reason: 'Financial news interest', contentIdea: 'How the economy affects your wallet' },
        { title: 'Climate Change Updates', reason: 'Environmental news', contentIdea: 'What you can do about climate change' },
        { title: 'Technology Policy', reason: 'Tech regulation news', contentIdea: 'New laws that affect your online life' },
    ],
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
                // Use user's saved preferences
                location = user.user_metadata.location || location
                industry = user.user_metadata.industry || industry
            }
        } catch {
            // Not authenticated, use query params
        }

        // Get all trends from Google
        const allTrends = await getDailyTrends(location)

        // If user has an industry, use AI to filter for 95%+ relevance
        let trends: any[] = allTrends
        let aiFiltered = false
        let aiGenerated = false
        let curatedFallback = false

        if (industry && industry !== 'ALL' && industry !== 'OTHER') {
            try {
                // Step 1: Try to filter existing trends for 95%+ relevance
                const aiResults = await filterTrendsByRelevance(allTrends, industry, 95)

                if (aiResults.length >= 3) {
                    // Found enough relevant trends in Google Trends
                    trends = aiResults.map(r => ({
                        title: r.title,
                        traffic: allTrends.find(t => t.title === r.title)?.traffic || '0',
                        relatedQueries: allTrends.find(t => t.title === r.title)?.relatedQueries || [],
                        industry: industry,
                        relevanceScore: r.relevanceScore,
                        reason: r.reason,
                        contentIdea: r.contentIdea,
                        formattedTraffic: allTrends.find(t => t.title === r.title)?.traffic || 'Trending',
                        source: 'Google Trends',
                    }))
                    aiFiltered = true
                } else {
                    // Step 2: Not enough matches - use AI to find/generate real niche trends
                    console.log(`Only ${aiResults.length} matches found, generating niche trends...`)
                    const generatedTrends = await generateNicheTrends(industry, 10)

                    if (generatedTrends.length > 0) {
                        // Combine any found + generated to ensure minimum 5
                        const foundTrends = aiResults.map(r => ({
                            title: r.title,
                            traffic: allTrends.find(t => t.title === r.title)?.traffic || 'Trending',
                            industry: industry,
                            relevanceScore: r.relevanceScore,
                            reason: r.reason,
                            contentIdea: r.contentIdea,
                            formattedTraffic: 'Live Trending',
                            source: 'Google Trends',
                        }))

                        const aiTrends = generatedTrends.map(t => ({
                            title: t.title,
                            traffic: 'Hot Topic',
                            industry: industry,
                            relevanceScore: t.relevanceScore,
                            reason: t.reason,
                            contentIdea: t.contentIdea,
                            formattedTraffic: 'AI Discovered',
                            source: (t as any).source || 'AI Discovered',
                        }))

                        // Prioritize live trends, then AI discovered
                        trends = [...foundTrends, ...aiTrends] // Return ALL trends, no limit
                        aiFiltered = foundTrends.length > 0
                        aiGenerated = aiTrends.length > 0
                    } else {
                        // AI generation failed - use curated fallback
                        const curated = CURATED_NICHE_TRENDS[industry] || CURATED_NICHE_TRENDS['TECH']
                        trends = curated.map((t, i) => ({
                            title: t.title,
                            relevanceScore: 95,
                            reason: t.reason,
                            contentIdea: t.contentIdea,
                            formattedTraffic: 'Hot Topic',
                            source: 'Curated',
                        }))
                        curatedFallback = true
                    }
                }
            } catch (error) {
                console.error('AI filtering failed:', error)
                // GUARANTEED FALLBACK - Use curated trends
                const curated = CURATED_NICHE_TRENDS[industry] || CURATED_NICHE_TRENDS['TECH']
                trends = curated.map((t, i) => ({
                    title: t.title,
                    relevanceScore: 95,
                    reason: t.reason,
                    contentIdea: t.contentIdea,
                    formattedTraffic: 'Hot Topic',
                    source: 'Curated',
                }))
                curatedFallback = true
            }
        }

        // FINAL SAFETY: If still empty after everything, use curated
        if (trends.length === 0 && industry && CURATED_NICHE_TRENDS[industry]) {
            const curated = CURATED_NICHE_TRENDS[industry]
            trends = curated.map((t, i) => ({
                title: t.title,
                relevanceScore: 95,
                reason: t.reason,
                contentIdea: t.contentIdea,
                formattedTraffic: 'Hot Topic',
                source: 'Curated',
            }))
            curatedFallback = true
        }

        // ALWAYS ADD: Curated trends for user's industry (guaranteed relevant)
        if (industry && industry !== 'ALL' && industry !== 'OTHER' && CURATED_NICHE_TRENDS[industry]) {
            const curated = CURATED_NICHE_TRENDS[industry]
            const curatedTrends = curated.map((t) => ({
                title: t.title,
                relevanceScore: 95,
                reason: t.reason,
                contentIdea: t.contentIdea,
                formattedTraffic: 'Hot Topic',
                source: 'Curated for You',
                // Pre-computed quick analysis for instant display (no loading needed)
                quickAnalysis: {
                    whyTrending: t.reason,
                    contentIdea: t.contentIdea,
                    isPreComputed: true
                }
            }))
            // Add curated that aren't already in trends (avoid duplicates)
            const existingTitles = new Set(trends.map((t: any) => t.title.toLowerCase()))
            const newCurated = curatedTrends.filter(t => !existingTitles.has(t.title.toLowerCase()))
            trends = [...trends, ...newCurated]
        }

        // DO NOT add unfiltered Google Trends - only show 70%+ relevant trends
        // The user's niche should not show random things like "SSC", "Dileep Case" etc.

        return NextResponse.json({
            success: true,
            trends,
            personalization: {
                location,
                industry: industry || 'ALL',
                aiFiltered,
                aiGenerated,
                curatedFallback,
                totalCount: trends.length,
                message: curatedFallback
                    ? `Showing curated ${(industry || 'niche').toLowerCase()} trends`
                    : aiGenerated
                        ? `Showing AI-discovered ${(industry || 'niche').toLowerCase()} trends`
                        : null
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
