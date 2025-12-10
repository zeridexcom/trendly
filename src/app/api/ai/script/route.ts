import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Use the exact same pattern as lib/ai.ts
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI | null {
    if (openaiClient) return openaiClient

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) {
        console.error('OPENROUTER_API_KEY or OPENAI_API_KEY not found in environment')
        return null
    }

    openaiClient = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        defaultHeaders: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Trendly - Social Media Content Platform',
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

        console.log('Script generation request:', { idea, platform, userIndustry })

        if (!idea || !platform) {
            return NextResponse.json({ success: false, error: 'Missing idea or platform' }, { status: 400 })
        }

        const openai = getOpenAI()
        if (!openai) {
            console.error('OpenAI client not initialized - check OPENROUTER_API_KEY')
            return NextResponse.json({
                success: false,
                error: 'AI service not configured. Please check OPENROUTER_API_KEY in Vercel environment variables.'
            }, { status: 500 })
        }

        const platformConfig = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram

        const prompt = `You are a viral content scriptwriter. Create a COMPLETE, DETAILED script.

CONTENT IDEA: ${idea}
PLATFORM: ${platform.replace('_', ' ').toUpperCase()} (${platformConfig.format}, ${platformConfig.maxDuration})
INDUSTRY: ${userIndustry || 'General'}
${videoContext ? `INSPIRATION VIDEO: "${videoContext.title}"` : ''}

Generate a DETAILED script with this EXACT JSON structure:
{
    "title": "Catchy title for the content",
    "hook": {
        "text": "Attention-grabbing opening line - specific to the topic",
        "duration": "0-3 seconds",
        "delivery": "Energy level, emotion, pace instructions",
        "visualNote": "What should appear on screen"
    },
    "sections": [
        {
            "title": "Section name",
            "script": "Full script text - exactly what to say. At least 2-3 complete sentences.",
            "duration": "Time for this section",
            "delivery": "Tone and delivery instructions",
            "bRoll": ["B-roll suggestion 1", "B-roll suggestion 2"],
            "camera": "Camera angle/shot type",
            "graphics": "Text overlays or graphics"
        }
    ],
    "cta": {
        "text": "Call-to-action script",
        "type": "follow/like/comment/subscribe"
    },
    "production": {
        "musicMood": "Music style/mood",
        "props": ["Prop 1", "Prop 2"],
        "location": "Filming location",
        "lighting": "Lighting setup",
        "outfit": "What to wear"
    },
    "caption": "Ready-to-post caption with emojis",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
    "viralityScore": 85,
    "viralityReason": "Why this has viral potential",
    "estimatedViews": "10K-50K",
    "bestTimeToPost": "Best posting time"
}

RULES:
1. Include 4-5 content sections with detailed scripts
2. Make the hook specific to the topic
3. Each section script should be 2-3 full sentences minimum
4. Return ONLY valid JSON, no markdown

Return ONLY the JSON object.`

        console.log('Calling OpenRouter API...')

        const response = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-001',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert viral content scriptwriter. Always return valid JSON only.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        })

        const content = response.choices[0]?.message?.content
        console.log('OpenRouter response received, length:', content?.length)

        if (!content) {
            return NextResponse.json({ success: false, error: 'No response from AI' }, { status: 500 })
        }

        // Parse JSON - try multiple cleanup approaches
        let script
        try {
            // Remove markdown code blocks if present
            let jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
            // Remove any leading/trailing whitespace or newlines
            jsonStr = jsonStr.replace(/^\s+|\s+$/g, '')
            script = JSON.parse(jsonStr)
        } catch (parseError) {
            console.error('JSON parse error:', parseError)
            console.error('Raw content:', content.substring(0, 500))
            return NextResponse.json({
                success: false,
                error: 'Failed to parse AI response. Please try again.',
                rawContent: content.substring(0, 200)
            }, { status: 500 })
        }

        console.log('Script generated successfully:', script.title)

        return NextResponse.json({
            success: true,
            script,
            platform,
            platformConfig
        })

    } catch (error: any) {
        console.error('Script generation error:', error.message || error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate script. Check server logs.'
        }, { status: 500 })
    }
}
