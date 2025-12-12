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
            'X-Title': 'Trendllly - Social Media Content Platform',
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

        const prompt = `You are a top-tier human content creator who writes scripts that feel REAL, AUTHENTIC, and PERSONAL. 
Your scripts should sound like a friend talking to a friend - NOT like an AI or a corporate robot.

CONTENT IDEA: ${idea}
PLATFORM: ${platform.replace('_', ' ').toUpperCase()} (${platformConfig.format}, ${platformConfig.maxDuration})
CREATOR'S NICHE: ${userIndustry || 'General'}
${videoContext ? `INSPIRED BY: "${videoContext.title}"` : ''}

WRITING STYLE REQUIREMENTS:
- Write like a REAL PERSON, not a robot. Use contractions (I'm, you're, don't, can't)
- Include natural filler words occasionally (like, honestly, look, okay so)
- Add personality - be witty, relatable, maybe even slightly imperfect
- Use casual language, not corporate speak
- Include personal touches like "I've been doing this for years" or "here's what I learned"
- Make it sound like something you'd actually hear a real YouTuber or TikToker say
- Add emotion - excitement, surprise, frustration, humor where appropriate
- Include rhetorical questions to engage viewers
- Use short punchy sentences mixed with longer ones for rhythm

Generate a script in this JSON structure:
{
    "title": "Catchy, clickable title that sounds human",
    "hook": {
        "text": "Opening line that grabs attention IMMEDIATELY. Should sound natural, like you're already mid-conversation. Examples: 'Okay so I need to tell you about this...' or 'You're not gonna believe what happened' or 'Stop scrolling - this is important'",
        "duration": "0-3 seconds",
        "delivery": "Natural, like talking to a friend",
        "visualNote": "Close-up, expressive"
    },
    "sections": [
        {
            "title": "Section name",
            "script": "Write this exactly as you would SAY it out loud. Include natural pauses, emphasis words, and casual language. Make it feel like a real person talking, not reading from a teleprompter. 3-5 sentences that flow naturally.",
            "duration": "Time estimate",
            "delivery": "Tone - conversational, excited, serious, etc",
            "bRoll": ["Specific relevant footage"],
            "camera": "Shot type",
            "graphics": "Any text overlays"
        }
    ],
    "cta": {
        "text": "Natural call-to-action that doesn't sound forced. Like 'If this helped, smash that follow button!' or 'Drop a comment telling me your experience'",
        "type": "follow/like/comment"
    },
    "production": {
        "musicMood": "Trending/upbeat/chill",
        "props": ["Relevant items"],
        "location": "Where to film",
        "lighting": "Setup",
        "outfit": "Casual/professional"
    },
    "caption": "Caption that sounds human with emojis, not overly polished. Include a question to boost engagement.",
    "hashtags": ["relevant", "trending", "niche", "hashtags"],
    "viralityScore": 85,
    "viralityReason": "Why this will resonate",
    "estimatedViews": "View range",
    "bestTimeToPost": "Best time"
}

CRITICAL: The script text in each section MUST sound like a real human speaking naturally. NO corporate language, NO AI-sounding phrases like "In this video we will explore" or "Let me break this down for you". Instead use phrases like "Okay so here's the thing..." or "I gotta be honest with you..." or "This is gonna blow your mind..."

Return ONLY valid JSON.`

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
