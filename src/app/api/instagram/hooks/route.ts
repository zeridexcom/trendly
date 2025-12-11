import { NextRequest, NextResponse } from 'next/server'

// Massive database of viral hooks organized by type
const VIRAL_HOOKS = {
    attention: [
        { hook: "Wait for it...", uses: "12M", category: "Suspense" },
        { hook: "Stop scrolling, this is important", uses: "8.5M", category: "Urgency" },
        { hook: "POV: You just discovered...", uses: "15M", category: "POV" },
        { hook: "Nobody talks about this but...", uses: "6.2M", category: "Secret" },
        { hook: "This changed everything", uses: "9.1M", category: "Transformation" },
        { hook: "I need to tell you something", uses: "4.8M", category: "Personal" },
        { hook: "Don't skip this", uses: "7.3M", category: "Urgency" },
        { hook: "Watch until the end", uses: "11M", category: "Suspense" },
        { hook: "You won't believe what happened", uses: "5.5M", category: "Curiosity" },
        { hook: "This is your sign to...", uses: "8.9M", category: "Motivation" },
    ],
    storytelling: [
        { hook: "Story time: How I...", uses: "14M", category: "Personal" },
        { hook: "Let me tell you about the time...", uses: "6.8M", category: "Story" },
        { hook: "So basically what happened was...", uses: "9.2M", category: "Casual" },
        { hook: "I wasn't going to post this but...", uses: "7.5M", category: "Exclusive" },
        { hook: "Here's what they don't show you", uses: "5.1M", category: "Behind Scenes" },
        { hook: "Day 1 of...", uses: "12M", category: "Journey" },
        { hook: "The honest truth about...", uses: "4.9M", category: "Real Talk" },
        { hook: "What I wish I knew before...", uses: "8.3M", category: "Advice" },
        { hook: "My toxic trait is...", uses: "6.7M", category: "Relatable" },
        { hook: "Unpopular opinion:", uses: "11M", category: "Hot Take" },
    ],
    educational: [
        { hook: "Here's a hack for...", uses: "9.8M", category: "Tips" },
        { hook: "5 things you need to know about...", uses: "7.2M", category: "List" },
        { hook: "Stop doing this immediately", uses: "6.5M", category: "Warning" },
        { hook: "The secret to...", uses: "8.1M", category: "Secret" },
        { hook: "Why you're doing it wrong", uses: "5.4M", category: "Correction" },
        { hook: "Fun fact:", uses: "10M", category: "Fact" },
        { hook: "Did you know that...", uses: "12M", category: "Question" },
        { hook: "Here's how to... in 30 seconds", uses: "8.8M", category: "Quick Tip" },
        { hook: "Most people don't know this but...", uses: "7.9M", category: "Secret" },
        { hook: "If you're struggling with... try this", uses: "5.2M", category: "Solution" },
    ],
    relatable: [
        { hook: "Tell me you're a [blank] without telling me", uses: "15M", category: "Trend" },
        { hook: "When someone says [blank]", uses: "11M", category: "Reaction" },
        { hook: "Me when...", uses: "18M", category: "Meme" },
        { hook: "That moment when...", uses: "13M", category: "Relatable" },
        { hook: "Things that just make sense:", uses: "6.8M", category: "List" },
        { hook: "Red flags:", uses: "9.5M", category: "List" },
        { hook: "Green flags:", uses: "7.2M", category: "List" },
        { hook: "Signs you're...", uses: "8.4M", category: "List" },
        { hook: "Girls who [blank] understand", uses: "5.9M", category: "Niche" },
        { hook: "Introverts will understand", uses: "6.1M", category: "Personality" },
    ],
    transformation: [
        { hook: "Before vs After", uses: "20M", category: "Visual" },
        { hook: "Glow up check", uses: "12M", category: "Transformation" },
        { hook: "How it started vs How it's going", uses: "15M", category: "Journey" },
        { hook: "Watch me transform...", uses: "8.5M", category: "Tutorial" },
        { hook: "0 to 100 real quick", uses: "6.3M", category: "Fast" },
        { hook: "What I ordered vs What arrived", uses: "9.1M", category: "Comparison" },
        { hook: "Expectation vs Reality", uses: "11M", category: "Humor" },
        { hook: "The difference is crazy", uses: "5.8M", category: "Comparison" },
        { hook: "Same outfit, different vibe", uses: "4.2M", category: "Fashion" },
        { hook: "Morning routine that changed my life", uses: "7.4M", category: "Routine" },
    ],
    engagement: [
        { hook: "Comment [emoji] if you agree", uses: "14M", category: "CTA" },
        { hook: "Save this for later", uses: "18M", category: "CTA" },
        { hook: "Share with someone who needs this", uses: "12M", category: "CTA" },
        { hook: "Tag your bestie", uses: "9.5M", category: "CTA" },
        { hook: "Which one are you?", uses: "11M", category: "Poll" },
        { hook: "Rate this 1-10", uses: "8.2M", category: "Rating" },
        { hook: "Caption this", uses: "6.7M", category: "UGC" },
        { hook: "Would you try this?", uses: "10M", category: "Question" },
        { hook: "Drop a 🔥 if you felt this", uses: "7.8M", category: "CTA" },
        { hook: "Let me know in the comments", uses: "5.5M", category: "CTA" },
    ],
    trending: [
        { hook: "That girl era", uses: "8.5M", category: "Aesthetic" },
        { hook: "Main character energy", uses: "12M", category: "Vibe" },
        { hook: "Living my best life", uses: "9.2M", category: "Lifestyle" },
        { hook: "Roman Empire thoughts", uses: "6.8M", category: "Trend" },
        { hook: "Hot take:", uses: "11M", category: "Opinion" },
        { hook: "Core memory unlocked", uses: "7.5M", category: "Nostalgia" },
        { hook: "This is the vibe", uses: "5.9M", category: "Aesthetic" },
        { hook: "Give me attention", uses: "4.1M", category: "Trend" },
        { hook: "Soft launch:", uses: "6.3M", category: "Relationship" },
        { hook: "Hard launch:", uses: "5.8M", category: "Relationship" },
    ],
    nicheSpecific: {
        TECH: [
            { hook: "Tech hack you NEED:", uses: "2.1M", category: "Tech" },
            { hook: "This app is a game changer", uses: "3.5M", category: "Apps" },
            { hook: "iPhone users, try this", uses: "4.2M", category: "Apple" },
            { hook: "Hidden feature alert:", uses: "2.8M", category: "Tips" },
            { hook: "AI just did this...", uses: "1.9M", category: "AI" },
        ],
        GAMING: [
            { hook: "This clutch was insane", uses: "3.8M", category: "Gaming" },
            { hook: "Best play of my career", uses: "2.5M", category: "Gaming" },
            { hook: "When the lobby is scared", uses: "4.1M", category: "Gaming" },
            { hook: "New meta alert:", uses: "2.2M", category: "Tips" },
            { hook: "Lowkey the best strat", uses: "1.8M", category: "Tips" },
        ],
        FOOD: [
            { hook: "Recipe you need to try:", uses: "5.2M", category: "Recipe" },
            { hook: "Making [food] but make it gourmet", uses: "3.1M", category: "Cooking" },
            { hook: "Food hack that slaps:", uses: "4.5M", category: "Tips" },
            { hook: "What I eat in a day:", uses: "6.8M", category: "WIEIAD" },
            { hook: "Trying viral [food] recipe", uses: "3.9M", category: "Trend" },
        ],
        FITNESS: [
            { hook: "Workout that changed my body:", uses: "4.8M", category: "Fitness" },
            { hook: "Gym girlies, try this", uses: "3.2M", category: "Fitness" },
            { hook: "Form check on this exercise", uses: "2.1M", category: "Tips" },
            { hook: "My fitness journey:", uses: "5.5M", category: "Journey" },
            { hook: "Exercises everyone does wrong:", uses: "3.8M", category: "Tips" },
        ],
        FASHION: [
            { hook: "Outfit inspo:", uses: "4.5M", category: "Fashion" },
            { hook: "How to style [item]:", uses: "3.8M", category: "Tips" },
            { hook: "GRWM for...", uses: "6.2M", category: "GRWM" },
            { hook: "Affordable dupe alert:", uses: "2.9M", category: "Dupes" },
            { hook: "Thrift flip:", uses: "2.5M", category: "DIY" },
        ],
    }
}

// Convert to flat array for easy filtering
const getAllHooks = () => {
    const allHooks: any[] = []

    // Add categorized hooks
    Object.entries(VIRAL_HOOKS).forEach(([type, hooks]) => {
        if (type !== 'nicheSpecific' && Array.isArray(hooks)) {
            hooks.forEach(h => allHooks.push({ ...h, type }))
        }
    })

    // Add niche-specific hooks
    Object.entries(VIRAL_HOOKS.nicheSpecific).forEach(([niche, hooks]) => {
        hooks.forEach(h => allHooks.push({ ...h, type: 'niche', niche }))
    })

    return allHooks
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const niche = searchParams.get('niche')
    const limit = parseInt(searchParams.get('limit') || '50')

    let hooks = getAllHooks()

    // Filter by type
    if (type && type !== 'all') {
        hooks = hooks.filter(h => h.type === type)
    }

    // Filter by niche
    if (niche && niche !== 'ALL') {
        const nicheHooks = VIRAL_HOOKS.nicheSpecific[niche as keyof typeof VIRAL_HOOKS.nicheSpecific] || []
        hooks = [...hooks.filter(h => !h.niche), ...nicheHooks.map(h => ({ ...h, type: 'niche', niche }))]
    }

    // Sort by uses
    hooks.sort((a, b) => {
        const usesA = parseFloat(a.uses.replace(/[MK]/g, ''))
        const usesB = parseFloat(b.uses.replace(/[MK]/g, ''))
        const multiplierA = a.uses.includes('M') ? 1000000 : 1000
        const multiplierB = b.uses.includes('M') ? 1000000 : 1000
        return (usesB * multiplierB) - (usesA * multiplierA)
    })

    // Limit results
    hooks = hooks.slice(0, limit)

    const categories = ['attention', 'storytelling', 'educational', 'relatable', 'transformation', 'engagement', 'trending']

    return NextResponse.json({
        success: true,
        hooks,
        categories,
        total: getAllHooks().length,
        updatedAt: new Date().toISOString()
    })
}
