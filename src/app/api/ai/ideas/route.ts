import { NextResponse } from 'next/server'
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
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://Trendllly.app',
            'X-Title': 'Trendllly - Content Ideas',
        },
    })

    return openaiClient
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // New video-based request
        if (body.videoTitle) {
            return await generateVideoBasedIdeas(body)
        }

        // Legacy brand-based request
        const { brandName, brandNiche, audienceDescription, platforms, goal, numberOfIdeas, brandTone } = body

        if (!brandName || !brandNiche) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const openai = getOpenAI()
        if (!openai) {
            return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
        }

        const prompt = `Generate ${numberOfIdeas || 5} viral content ideas for:
Brand: ${brandName}
Niche: ${brandNiche}
Audience: ${audienceDescription || 'General'}
Platforms: ${platforms?.join(', ') || 'Social media'}
Goal: ${goal || 'Engagement'}
Tone: ${brandTone || 'Professional'}

Return as JSON array with: title, hook, format, angle, estimatedViews`

        const response = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content || '[]'
        let ideas = []
        try {
            ideas = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
        } catch {
            ideas = []
        }

        return NextResponse.json({ success: true, ideas })
    } catch (error) {
        console.error('Idea generation error:', error)
        return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 })
    }
}

// Generate ideas based on a video
async function generateVideoBasedIdeas(body: { videoTitle: string; videoContext?: string; userIndustry?: string; count?: number }) {
    const { videoTitle, videoContext, userIndustry, count } = body

    const openai = getOpenAI()
    if (!openai) {
        return NextResponse.json({ success: false, error: 'AI not configured' }, { status: 500 })
    }

    const prompt = `You are a viral content strategist. Analyze this trending video and generate ${count || 6} UNIQUE content ideas.

VIDEO TITLE: "${videoTitle}"
${videoContext ? `CONTEXT: ${videoContext}` : ''}
USER'S NICHE: ${userIndustry || 'General'}

IMPORTANT: Generate ideas that are DIRECTLY RELEVANT to the video topic. 
- If video is about NEWS → give news commentary, reaction, analysis ideas
- If video is about TECH → give review, comparison, tutorial ideas
- If video is about POLITICS → give hot take, analysis, prediction ideas
- If video is about ENTERTAINMENT → give reaction, commentary, trend ideas

Return ONLY a JSON array with exactly ${count || 6} objects:
[
    {
        "title": "Specific catchy title related to the video topic",
        "hook": "Opening line that grabs attention (specific to topic)",
        "format": "Video format (Reaction/Analysis/Explainer/Hot Take/Commentary/Review/Tutorial)",
        "angle": "Unique angle or perspective",
        "estimatedViews": "View range like 50K-200K"
    }
]

CRITICAL: Each idea MUST directly relate to "${videoTitle}". Do NOT give generic ideas like "Beginner's Guide" unless the video is actually educational.

Return ONLY valid JSON array, no markdown.`

    try {
        const response = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.9,
            max_tokens: 2000,
        })

        const content = response.choices[0]?.message?.content || '[]'
        let ideas = []

        try {
            const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
            ideas = JSON.parse(jsonStr)
        } catch (parseError) {
            console.error('Failed to parse AI ideas:', content)
            return NextResponse.json({ success: false, error: 'Failed to parse ideas' })
        }

        if (!Array.isArray(ideas) || ideas.length === 0) {
            return NextResponse.json({ success: false, error: 'No ideas generated' })
        }

        return NextResponse.json({ success: true, ideas })
    } catch (error: any) {
        console.error('AI ideas generation failed:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
