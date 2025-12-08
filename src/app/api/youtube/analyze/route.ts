import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

// POST /api/youtube/analyze - Analyze why a video went viral with deep insights
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { video } = body

        // Get user industry for personalized analysis
        let userIndustry = 'GENERAL'
        try {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.user_metadata?.industry) {
                userIndustry = user.user_metadata.industry
            }
        } catch {
            // Not authenticated
        }

        if (!video) {
            return NextResponse.json(
                { success: false, error: 'Video data is required' },
                { status: 400 }
            )
        }

        const prompt = `You are an expert viral content analyst. Analyze this YouTube video that went viral:

VIDEO DETAILS:
- Title: "${video.title}"
- Channel: ${video.channelTitle}
- Views: ${video.formattedViews || video.viewCount?.toLocaleString()}
- Likes: ${video.formattedLikes || video.likeCount?.toLocaleString()}
- Comments: ${video.formattedComments || video.commentCount?.toLocaleString()}
- Engagement Rate: ${video.engagementRate}
- Description: ${video.description?.slice(0, 300) || 'N/A'}
- Tags: ${video.tags?.slice(0, 15).join(', ') || 'N/A'}

IMPORTANT: The video might be in Hindi, Telugu, Tamil, or other regional languages. Provide the viral hook in the ORIGINAL LANGUAGE as well as translated to English.

Provide comprehensive analysis in this JSON format:
{
    "viralScore": 85,
    "whyViral": "Detailed 3-4 sentence explanation of why this video went viral - what made millions click on it",
    "viralHook": {
        "original": "The exact opening line/hook used in the video (in original language if regional)",
        "englishTranslation": "English translation of the hook",
        "hookType": "Type of hook: Question, Shock Value, Curiosity Gap, Controversy, Promise, etc.",
        "hookAnalysis": "Why this specific hook works psychologically"
    },
    "keyFactors": [
        {"factor": "Thumbnail & Title", "analysis": "How thumbnail and title grabbed attention", "impact": "HIGH"},
        {"factor": "Content Hook", "analysis": "What keeps viewers watching", "impact": "HIGH"},
        {"factor": "Emotional Trigger", "analysis": "What emotion does this trigger", "impact": "MEDIUM"},
        {"factor": "Timing/Relevance", "analysis": "Why timing was perfect", "impact": "MEDIUM"}
    ],
    "thumbnailInsights": "What makes this thumbnail click-worthy and how to replicate",
    "titleAnalysis": "Breaking down why this title works - emotional triggers, curiosity gaps, power words",
    "contentStrategy": "The content strategy being used - storytelling, education, controversy, etc.",
    "audienceAppeal": "Who this video appeals to and why it resonates with them",
    "topicSummary": "What is the video actually about - the main content/topic explained briefly",
    "suggestedHashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8"],
    "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
    "suggestedCaption": "A catchy caption for similar content for Instagram/YouTube shorts",
    "suggestedDescription": "A 3-4 line optimized description for similar content with emojis and call to action",
    "recreateStrategy": {
        "yourTitle": "A title YOU should use for similar content in ${userIndustry} niche",
        "yourHook": "Opening hook for YOUR version (first 3.5 seconds)",
        "yourFormat": "Recommended format (short/long, talking head, voiceover, etc.)",
        "yourAngle": "Unique angle to differentiate your content",
        "keyElements": ["must-include element 1", "must-include element 2", "must-include element 3"]
    },
    "doThis": ["Specific actionable tip 1", "Specific actionable tip 2", "Specific actionable tip 3", "Specific actionable tip 4"],
    "avoidThis": ["Common mistake 1", "Common mistake 2", "Common mistake 3"]
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
                userIndustry,
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
