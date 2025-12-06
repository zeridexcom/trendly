import { NextRequest, NextResponse } from 'next/server'

// Types
interface ScriptRequest {
    topic: string
    platform: 'tiktok' | 'youtube' | 'instagram' | 'shorts'
    duration: '15s' | '30s' | '60s' | '3min' | '10min'
    tone: 'casual' | 'professional' | 'energetic' | 'educational' | 'storytelling'
    userPreferences?: UserPreferences
}

interface UserPreferences {
    preferredHookStyle: string[]
    preferredCTAStyle: string[]
    avoidPhrases: string[]
    successfulPatterns: string[]
    averageRating: number
    totalScriptsRated: number
}

interface GeneratedScript {
    id: string
    hook: {
        text: string
        duration: string
        tips: string[]
    }
    content: {
        sections: {
            title: string
            text: string
            duration: string
            bRoll: string[]
        }[]
    }
    cta: {
        text: string
        type: 'subscribe' | 'comment' | 'share' | 'link' | 'follow'
        tips: string[]
    }
    bRollSuggestions: string[]
    musicMood: string
    estimatedDuration: string
    viralityScore: number
    metadata: {
        topic: string
        platform: string
        tone: string
        generatedAt: string
    }
}

// Generate script based on preferences
function generateScript(request: ScriptRequest): GeneratedScript {
    const { topic, platform, duration, tone, userPreferences } = request

    // Duration configs
    const durationConfigs: Record<string, { sections: number; hookTime: string; contentTime: string; ctaTime: string }> = {
        '15s': { sections: 1, hookTime: '0-3s', contentTime: '3-12s', ctaTime: '12-15s' },
        '30s': { sections: 2, hookTime: '0-5s', contentTime: '5-25s', ctaTime: '25-30s' },
        '60s': { sections: 3, hookTime: '0-5s', contentTime: '5-50s', ctaTime: '50-60s' },
        '3min': { sections: 5, hookTime: '0-10s', contentTime: '10-160s', ctaTime: '160-180s' },
        '10min': { sections: 8, hookTime: '0-15s', contentTime: '15-570s', ctaTime: '570-600s' },
    }

    const config = durationConfigs[duration] || durationConfigs['60s']

    // Hook templates based on tone
    const hookTemplates: Record<string, string[]> = {
        casual: [
            `So I tried ${topic} and here's what happened...`,
            `Y'all, we need to talk about ${topic}`,
            `Why is nobody talking about ${topic}?`,
        ],
        professional: [
            `Here are 3 things you need to know about ${topic}`,
            `The truth about ${topic} that experts won't tell you`,
            `I spent 100 hours researching ${topic}. Here's what I found.`,
        ],
        energetic: [
            `THIS changed everything about ${topic}! 🔥`,
            `STOP scrolling! You NEED to see this about ${topic}!`,
            `The ${topic} hack that blew my mind! 🤯`,
        ],
        educational: [
            `Let me explain ${topic} in 60 seconds`,
            `The science behind ${topic} is fascinating`,
            `Here's how ${topic} actually works`,
        ],
        storytelling: [
            `I never thought ${topic} would change my life...`,
            `A year ago, I discovered ${topic}. Here's my journey.`,
            `The day I learned about ${topic}, everything changed.`,
        ],
    }

    // Select hook based on preferences or default
    const hooks = hookTemplates[tone] || hookTemplates.casual
    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)]

    // Generate content sections
    const contentSections = []
    const sectionTitles = [
        'The Problem',
        'The Discovery',
        'The Solution',
        'The Results',
        'Key Insight',
        'Pro Tip',
        'Common Mistake',
        'The Secret',
    ]

    for (let i = 0; i < config.sections; i++) {
        contentSections.push({
            title: sectionTitles[i % sectionTitles.length],
            text: `[${sectionTitles[i % sectionTitles.length]}] Explain the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} point about ${topic}. Keep it concise and engaging. Use examples your audience can relate to.`,
            duration: `${Math.floor(parseInt(config.contentTime) / config.sections)}s`,
            bRoll: [
                `Show ${topic} in action`,
                `Cut to relevant visually`,
                `Display text overlay with key point`,
            ]
        })
    }

    // CTA templates
    const ctaTemplates: Record<string, { text: string; type: 'subscribe' | 'comment' | 'share' | 'link' | 'follow' }[]> = {
        tiktok: [
            { text: 'Follow for more tips like this!', type: 'follow' },
            { text: 'Save this for later! 📌', type: 'share' },
            { text: 'Comment "YES" if you learned something new!', type: 'comment' },
        ],
        youtube: [
            { text: 'Subscribe and hit the bell for more!', type: 'subscribe' },
            { text: 'Drop a like if this helped you!', type: 'comment' },
            { text: 'Check the link in description for more', type: 'link' },
        ],
        instagram: [
            { text: 'Save this reel for later!', type: 'share' },
            { text: 'Follow for daily tips!', type: 'follow' },
            { text: 'Tag someone who needs this!', type: 'share' },
        ],
        shorts: [
            { text: 'Subscribe for more shorts like this!', type: 'subscribe' },
            { text: 'Like and follow for part 2!', type: 'follow' },
            { text: 'Comment what topic you want next!', type: 'comment' },
        ],
    }

    const ctas = ctaTemplates[platform] || ctaTemplates.tiktok
    const selectedCTA = ctas[Math.floor(Math.random() * ctas.length)]

    // B-Roll suggestions
    const bRollSuggestions = [
        `Wide shot establishing ${topic}`,
        `Close-up detail shots`,
        `Screen recording / demonstration`,
        `Text overlays with key points`,
        `Transition cuts for pacing`,
        `Reaction shots (if face cam)`,
        `Stock footage related to ${topic}`,
    ]

    // Music mood based on tone
    const musicMoods: Record<string, string> = {
        casual: 'Lo-fi, chill beats',
        professional: 'Corporate, inspiring',
        energetic: 'Upbeat, trending audio',
        educational: 'Soft background, minimal',
        storytelling: 'Emotional, cinematic',
    }

    // Calculate virality score (mock - in real app would use ML)
    const baseScore = 65
    const toneBonus = tone === 'energetic' ? 15 : tone === 'storytelling' ? 10 : 5
    const platformBonus = platform === 'tiktok' ? 10 : platform === 'shorts' ? 8 : 5
    const preferencesBonus = userPreferences?.averageRating ? (userPreferences.averageRating - 3) * 5 : 0
    const viralityScore = Math.min(98, Math.max(50, baseScore + toneBonus + platformBonus + preferencesBonus))

    return {
        id: `script_${Date.now()}`,
        hook: {
            text: selectedHook,
            duration: config.hookTime,
            tips: [
                'Deliver with energy in first 2 seconds',
                'Make eye contact with camera',
                'Use pattern interrupt (movement, sound)',
            ]
        },
        content: {
            sections: contentSections
        },
        cta: {
            text: selectedCTA.text,
            type: selectedCTA.type,
            tips: [
                'Say CTA while showing action',
                'Point to subscribe button',
                'Create urgency',
            ]
        },
        bRollSuggestions,
        musicMood: musicMoods[tone] || 'Chill, trending',
        estimatedDuration: duration,
        viralityScore,
        metadata: {
            topic,
            platform,
            tone,
            generatedAt: new Date().toISOString()
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ScriptRequest = await request.json()

        if (!body.topic || body.topic.trim().length < 3) {
            return NextResponse.json(
                { error: 'Please provide a topic (at least 3 characters)' },
                { status: 400 }
            )
        }

        const script = generateScript(body)

        return NextResponse.json(script)
    } catch (error) {
        console.error('Script Generation Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate script' },
            { status: 500 }
        )
    }
}
