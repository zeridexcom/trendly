import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/ai'

// POST /api/trends/analyze - Analyze why a Google Trend topic is trending
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { trend, traffic, industry } = body

        if (!trend) {
            return NextResponse.json(
                { success: false, error: 'Trend topic is required' },
                { status: 400 }
            )
        }

        const prompt = `You are a trend analyst and content strategist. Analyze why this topic is trending on Google:

TRENDING TOPIC: "${trend}"
SEARCH VOLUME: ${traffic || 'High'}
USER'S NICHE: ${industry || 'General'}

Provide a comprehensive analysis in JSON format:
{
    "whyTrending": "3-4 sentence explanation of WHY people are actively searching for this right now - what event, news, or cultural moment triggered this search spike",
    "searchIntent": "What are users actually looking for when they search this? Information, solutions, entertainment, news updates?",
    "audienceProfile": "Who is searching for this? Demographics, interests, what they care about",
    "contentAngles": [
        "Content angle 1 you could create about this topic",
        "Content angle 2 from a different perspective",
        "Content angle 3 that would stand out",
        "Content angle 4 for viral potential"
    ],
    "bestPlatforms": ["Best platform 1 for this topic", "Platform 2", "Platform 3"],
    "peakTiming": "When is the best time to post content about this - is it urgent (post now) or can wait?",
    "suggestedTitle": "A catchy title for content about this topic in ${industry} niche",
    "suggestedHook": "Opening hook to grab attention in first 3 seconds",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
    "keyPoints": ["Key point 1 to cover", "Key point 2", "Key point 3", "Key point 4"],
    "potentialViews": "Estimated view potential: LOW / MEDIUM / HIGH / VIRAL based on search volume and topic nature"
}`

        const aiResponse = await generateContent(prompt)

        // Parse JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response')
        }

        const analysis = JSON.parse(jsonMatch[0])

        return NextResponse.json({
            success: true,
            analysis,
            topic: trend,
            analyzedAt: new Date().toISOString(),
        })
    } catch (error: any) {
        console.error('Trend Analysis Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze trend' },
            { status: 500 }
        )
    }
}
