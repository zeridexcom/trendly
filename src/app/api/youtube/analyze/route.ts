import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/ai'

// POST /api/youtube/analyze - Analyze why a video went viral
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { video } = body

        if (!video) {
            return NextResponse.json(
                { success: false, error: 'Video data is required' },
                { status: 400 }
            )
        }

        const prompt = `You are a viral content expert and social media analyst. Analyze this YouTube video that is currently trending:

Title: "${video.title}"
Channel: ${video.channelTitle}
Views: ${video.formattedViews}
Likes: ${video.formattedLikes}
Comments: ${video.formattedComments}
Engagement Rate: ${video.engagementRate}
Category: ${video.categoryName}
Duration: ${video.formattedDuration}
Tags: ${video.tags?.slice(0, 10).join(', ') || 'N/A'}

Provide a detailed analysis in this JSON format:
{
    "viralScore": 85,
    "whyViral": "Main reason this video went viral in 2-3 sentences",
    "keyFactors": [
        {"factor": "Hook/Thumbnail", "analysis": "How the thumbnail and title grabbed attention", "impact": "HIGH/MEDIUM/LOW"},
        {"factor": "Content Format", "analysis": "Why this format works", "impact": "HIGH/MEDIUM/LOW"},
        {"factor": "Timing", "analysis": "Why the timing was right", "impact": "HIGH/MEDIUM/LOW"},
        {"factor": "Audience", "analysis": "Who this appeals to and why", "impact": "HIGH/MEDIUM/LOW"}
    ],
    "thumbnailInsights": "What makes the thumbnail click-worthy",
    "titleAnalysis": "Why this title works - emotional triggers, curiosity gaps, etc",
    "contentStrategy": "The content strategy being used (storytelling, education, entertainment, etc)",
    "audienceAppeal": "Why this resonates with the target audience",
    "recreateStrategy": {
        "yourTitle": "A similar title you could use",
        "yourHook": "Opening hook for your version",
        "yourFormat": "Recommended format",
        "yourAngle": "Unique angle to differentiate",
        "keyElements": ["element1", "element2", "element3"]
    },
    "doThis": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
    "avoidThis": ["mistake to avoid 1", "mistake to avoid 2"]
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
            data: {
                videoId: video.id,
                analysis,
                analyzedAt: new Date().toISOString(),
            }
        })
    } catch (error: any) {
        console.error('Video Analysis Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze video' },
            { status: 500 }
        )
    }
}
