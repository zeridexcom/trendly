import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

interface ScriptRequest {
    idea: string
    platform: string
    videoContext?: {
        title: string
        whyViral?: string
        hook?: string
    }
    userIndustry: string
}

// Platform-specific configurations
const PLATFORM_CONFIG: Record<string, {
    maxDuration: string
    format: string
    tips: string[]
}> = {
    instagram: {
        maxDuration: '60-90 seconds',
        format: 'Vertical 9:16 Reels',
        tips: [
            'Hook in first 0.5 seconds (face close-up or bold text)',
            'Use trending audio for 2x reach',
            'Add captions - 85% watch without sound',
            'End with CTA before loop point'
        ]
    },
    youtube: {
        maxDuration: '8-15 minutes',
        format: 'Horizontal 16:9',
        tips: [
            'First 30 seconds = retention killer or maker',
            'Pattern interrupt every 30-60 seconds',
            'Use chapters for longer videos',
            'End screen + cards in last 20 seconds'
        ]
    },
    youtube_shorts: {
        maxDuration: '30-60 seconds',
        format: 'Vertical 9:16',
        tips: [
            'Start with the payoff/result',
            'Fast cuts every 2-3 seconds',
            'Loop-worthy ending',
            'Text on screen for accessibility'
        ]
    },
    tiktok: {
        maxDuration: '15-60 seconds',
        format: 'Vertical 9:16',
        tips: [
            'Hook in first frame - no build up',
            'Trending sounds = algorithm boost',
            'Green screen effects work well',
            'Reply to comments with video'
        ]
    },
    blog: {
        maxDuration: '1500-2500 words',
        format: 'Written Article',
        tips: [
            'H2 every 300 words for scannability',
            'First paragraph = mini-summary',
            'Use bullet points and numbered lists',
            'Add internal/external links'
        ]
    },
    twitter: {
        maxDuration: '280 chars or thread',
        format: 'Thread (5-10 tweets)',
        tips: [
            'First tweet = hook + promise',
            'Each tweet = standalone value',
            'Use numbers and lists',
            'End with engagement question'
        ]
    },
    linkedin: {
        maxDuration: '1300 characters',
        format: 'Text Post or Article',
        tips: [
            'First line = hook (shows in preview)',
            'Use short paragraphs (1-2 lines)',
            'Add white space liberally',
            'End with question for engagement'
        ]
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ScriptRequest = await request.json()
        const { idea, platform, videoContext, userIndustry } = body

        if (!idea || !platform) {
            return NextResponse.json({ success: false, error: 'Missing idea or platform' }, { status: 400 })
        }

        const platformConfig = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram

        const prompt = `You are an expert viral content creator and scriptwriter who has studied thousands of viral videos.

TASK: Create a complete, ready-to-use script for ${platform.replace('_', ' ').toUpperCase()}.

CONTEXT:
- User's Industry: ${userIndustry}
- Content Idea: ${idea}
${videoContext ? `- Inspiration Video: "${videoContext.title}"
- Why It Went Viral: ${videoContext.whyViral || 'High engagement'}
- Original Hook: ${videoContext.hook || 'Compelling opening'}` : ''}

PLATFORM REQUIREMENTS:
- Format: ${platformConfig.format}
- Duration: ${platformConfig.maxDuration}
- Key Tips: ${platformConfig.tips.join(', ')}

Generate a complete script in this EXACT JSON format:
{
    "title": "Catchy title for the content",
    "hook": {
        "text": "The exact opening line/hook (attention-grabbing, controversial, or curiosity-inducing)",
        "duration": "0-3 seconds",
        "delivery": "How to deliver this hook (tone, speed, emotion)",
        "visualNote": "What should be on screen during hook"
    },
    "sections": [
        {
            "title": "Section name (e.g., 'Problem', 'Solution', 'Story')",
            "script": "Exact words to say in this section",
            "duration": "Time for this section",
            "delivery": "Tone and delivery instructions",
            "bRoll": ["List of B-roll footage suggestions"],
            "camera": "Camera angle/shot type (close-up, wide, etc.)",
            "graphics": "Any text overlays or graphics"
        }
    ],
    "cta": {
        "text": "The call-to-action script",
        "type": "follow/like/comment/subscribe/link"
    },
    "storyboard": [
        {
            "scene": 1,
            "duration": "0:00-0:03",
            "visual": "Description of what's on screen",
            "audio": "What's being said/music",
            "camera": "Camera setup/angle"
        }
    ],
    "production": {
        "musicMood": "Type of background music/trending sound",
        "props": ["List of props/items needed"],
        "location": "Suggested filming location",
        "lighting": "Lighting setup suggestion",
        "outfit": "What to wear suggestion"
    },
    "caption": "Ready-to-post caption for the platform",
    "hashtags": ["relevant", "trending", "hashtags"],
    "viralityScore": 85,
    "viralityReason": "Why this script has viral potential",
    "estimatedViews": "10K-50K",
    "bestTimeToPost": "Optimal posting time"
}

IMPORTANT RULES:
1. Hook MUST grab attention in first 0.5-1 second
2. Script should feel natural, not robotic
3. Include specific camera directions for each scene
4. Add pattern interrupts every 30-60 seconds for longer content
5. Make it actionable and ready to film TODAY
6. Tailor language and style to ${platform}
7. Use viral patterns: curiosity gap, controversy, transformation, before/after

Return ONLY valid JSON, no markdown or explanation.`

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://trendly.app',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                max_tokens: 3000,
            }),
        })

        if (!response.ok) {
            throw new Error('OpenRouter API failed')
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        // Parse JSON from response
        let script
        try {
            // Remove markdown code blocks if present
            const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
            script = JSON.parse(jsonStr)
        } catch {
            // If parsing fails, return raw content
            return NextResponse.json({
                success: false,
                error: 'Failed to parse script',
                raw: content
            })
        }

        return NextResponse.json({
            success: true,
            script,
            platform,
            platformConfig
        })

    } catch (error: any) {
        console.error('Script generation error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate script'
        }, { status: 500 })
    }
}
