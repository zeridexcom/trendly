import { NextRequest, NextResponse } from 'next/server'
import { getDailyTrends, formatTraffic, INDUSTRIES } from '@/lib/google-trends'
import { generateContent } from '@/lib/ai'

// GET /api/trends/google - Get Google trending searches
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const geo = searchParams.get('geo') || 'IN'

        const trends = await getDailyTrends(geo)

        const formattedTrends = trends.map(trend => ({
            ...trend,
            formattedTraffic: formatTraffic(trend.traffic),
        }))

        return NextResponse.json({
            success: true,
            data: {
                trends: formattedTrends,
                categories: INDUSTRIES,
                region: geo,
                fetchedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('Google Trends Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch trends' },
            { status: 500 }
        )
    }
}

// POST /api/trends/google - Generate content ideas from trending topic
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { topic, niche, platforms = ['YouTube', 'Instagram', 'Twitter'] } = body

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            )
        }

        const prompt = `You are a viral content strategist. Generate content ideas for the trending topic "${topic}"${niche ? ` in the ${niche} niche` : ''}.

Target platforms: ${platforms.join(', ')}

Provide ideas in this JSON format:
{
    "topicInsight": "Why this topic is trending and its viral potential",
    "audienceInterest": "Who is searching for this and why",
    "contentAngles": [
        {
            "angle": "Unique content angle",
            "platform": "Best platform for this",
            "format": "Video/Reel/Thread/Post",
            "title": "Catchy title",
            "hook": "Opening hook (first 3 seconds)",
            "outline": ["Point 1", "Point 2", "Point 3"],
            "cta": "Call to action",
            "estimatedViews": "10K-50K",
            "difficulty": "Easy/Medium/Hard"
        }
    ],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
    "bestTimeToPost": "When to post for maximum reach",
    "trendLifespan": "How long this trend will stay relevant",
    "competitorTip": "How to stand out from others covering this"
}`

        const aiResponse = await generateContent(prompt)

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response')
        }

        const ideas = JSON.parse(jsonMatch[0])

        return NextResponse.json({
            success: true,
            data: {
                topic,
                ideas,
                generatedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('Content Ideas Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate ideas' },
            { status: 500 }
        )
    }
}
