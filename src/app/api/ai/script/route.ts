import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI | null {
    if (openaiClient) return openaiClient

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) return null

    openaiClient = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        defaultHeaders: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://trendly.app',
            'X-Title': 'Trendly - Content Creation',
        },
    })

    return openaiClient
}

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

// Platform configs
const PLATFORM_CONFIG: Record<string, { maxDuration: string; format: string; tips: string[] }> = {
    instagram: { maxDuration: '60-90 seconds', format: 'Vertical 9:16 Reels', tips: ['Hook in first 0.5 seconds', 'Use trending audio', 'Add captions'] },
    youtube: { maxDuration: '8-15 minutes', format: 'Horizontal 16:9', tips: ['First 30 seconds = retention killer', 'Pattern interrupt every 30-60 seconds'] },
    youtube_shorts: { maxDuration: '30-60 seconds', format: 'Vertical 9:16', tips: ['Start with the payoff', 'Fast cuts every 2-3 seconds'] },
    tiktok: { maxDuration: '15-60 seconds', format: 'Vertical 9:16', tips: ['Hook in first frame', 'Trending sounds = algorithm boost'] },
    blog: { maxDuration: '1500-2500 words', format: 'Written Article', tips: ['H2 every 300 words', 'Use bullet points'] },
    twitter: { maxDuration: '280 chars or thread', format: 'Thread (5-10 tweets)', tips: ['First tweet = hook + promise'] },
    linkedin: { maxDuration: '1300 characters', format: 'Text Post', tips: ['First line = hook', 'Short paragraphs'] }
}

export async function POST(request: NextRequest) {
    try {
        const body: ScriptRequest = await request.json()
        const { idea, platform, videoContext, userIndustry } = body

        if (!idea || !platform) {
            return NextResponse.json({ success: false, error: 'Missing idea or platform' }, { status: 400 })
        }

        const openai = getOpenAI()
        if (!openai) {
            return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 500 })
        }

        const platformConfig = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram

        const prompt = `You are a viral content scriptwriter. Create a COMPLETE, DETAILED script.

CONTENT IDEA: ${idea}
PLATFORM: ${platform.replace('_', ' ').toUpperCase()} (${platformConfig.format}, ${platformConfig.maxDuration})
INDUSTRY: ${userIndustry}
${videoContext ? `INSPIRATION: "${videoContext.title}"` : ''}

Generate a DETAILED script with this EXACT JSON structure:
{
    "title": "Catchy title",
    "hook": {
        "text": "Attention-grabbing opening line that creates curiosity or shock. Make it SPECIFIC and PUNCHY, not generic.",
        "duration": "0-3 seconds",
        "delivery": "How to deliver (energy level, emotion, pace)",
        "visualNote": "What should be on screen"
    },
    "sections": [
        {
            "title": "PROBLEM/SETUP",
            "script": "Full paragraph of exactly what to say. Be specific, conversational, engaging. At least 2-3 sentences.",
            "duration": "10-15 seconds",
            "delivery": "Tone instructions",
            "bRoll": ["Specific B-roll 1", "Specific B-roll 2"],
            "camera": "Close-up / Medium / Wide",
            "graphics": "Text overlay description"
        },
        {
            "title": "MAIN POINT 1",
            "script": "Detailed explanation of the first key point. Be specific and actionable. Include examples.",
            "duration": "15-20 seconds",
            "delivery": "Delivery notes",
            "bRoll": ["B-roll suggestion"],
            "camera": "Shot type",
            "graphics": "Graphics/text"
        },
        {
            "title": "MAIN POINT 2",
            "script": "Second key insight or tip. Make it practical and memorable.",
            "duration": "15-20 seconds",
            "delivery": "Notes",
            "bRoll": ["B-roll"],
            "camera": "Shot",
            "graphics": "Text overlay"
        },
        {
            "title": "MAIN POINT 3",
            "script": "Third insight or the 'secret sauce' that makes this content valuable.",
            "duration": "15-20 seconds",
            "delivery": "Notes",
            "bRoll": ["B-roll"],
            "camera": "Shot",
            "graphics": "Graphics"
        },
        {
            "title": "CONCLUSION/WRAP-UP",
            "script": "Summarize the key takeaways. Remind them why this matters.",
            "duration": "5-10 seconds",
            "delivery": "Notes",
            "bRoll": ["B-roll"],
            "camera": "Shot",
            "graphics": "Summary graphic"
        }
    ],
    "cta": {
        "text": "Strong call-to-action that tells them exactly what to do next",
        "type": "follow/like/comment/subscribe"
    },
    "production": {
        "musicMood": "Specific music style/mood",
        "props": ["Prop 1", "Prop 2"],
        "location": "Specific location suggestion",
        "lighting": "Lighting setup",
        "outfit": "What to wear"
    },
    "caption": "Ready-to-post caption with emojis and line breaks. Make it engaging and include a question.",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8"],
    "viralityScore": 85,
    "viralityReason": "Why this has viral potential",
    "estimatedViews": "10K-50K",
    "bestTimeToPost": "Best posting time"
}

CRITICAL RULES:
1. Each section's "script" must be DETAILED - at least 2-3 full sentences of what to actually SAY
2. Hook must be PUNCHY and SPECIFIC to the topic, not generic
3. Include at least 5 content sections (not just 3)
4. B-roll suggestions must be specific and actionable
5. Caption must be ready to copy-paste with line breaks and emojis

Return ONLY valid JSON.`

        const response = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 4000,
        })

        const content = response.choices[0]?.message?.content

        if (!content) {
            throw new Error('No response from AI')
        }

        // Parse JSON
        let script
        try {
            const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
            script = JSON.parse(jsonStr)
        } catch {
            console.error('Failed to parse:', content)
            throw new Error('Failed to parse script JSON')
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
