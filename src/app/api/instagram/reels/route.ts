import { NextRequest, NextResponse } from 'next/server'

// Curated viral reels content patterns and examples
const VIRAL_REELS = {
    formats: [
        {
            id: 'pov',
            name: 'POV (Point of View)',
            description: 'First-person perspective storytelling',
            avgViews: '500K-2M',
            difficulty: 'Easy',
            examples: [
                'POV: You just got promoted',
                'POV: Your crush finally texts back',
                'POV: You realize you forgot something important'
            ],
            tips: ['Use relatable scenarios', 'Keep it under 15 seconds', 'Strong emotional hook'],
            viralPotential: 85
        },
        {
            id: 'transition',
            name: 'Transition Reels',
            description: 'Smooth transitions between scenes/outfits',
            avgViews: '300K-1M',
            difficulty: 'Medium',
            examples: [
                'Outfit changes with beat drops',
                'Before/after transformations',
                'Location jumps'
            ],
            tips: ['Match transitions to beat drops', 'Practice timing', 'Use trending sounds'],
            viralPotential: 75
        },
        {
            id: 'tutorial',
            name: 'Quick Tutorial',
            description: 'Teach something in 15-60 seconds',
            avgViews: '200K-800K',
            difficulty: 'Easy',
            examples: [
                '3 iPhone hacks you didnt know',
                'How to style this one item 5 ways',
                'Secret menu hack at Starbucks'
            ],
            tips: ['Start with the end result', 'Keep steps simple', 'Save this for later CTA'],
            viralPotential: 80
        },
        {
            id: 'storytime',
            name: 'Story Time',
            description: 'Personal story with hooks',
            avgViews: '400K-1.5M',
            difficulty: 'Easy',
            examples: [
                'The craziest thing happened to me...',
                'I wasnt going to post this but...',
                'Nobody knows this about me...'
            ],
            tips: ['Hook in first 2 seconds', 'Build suspense', 'Unexpected endings work best'],
            viralPotential: 90
        },
        {
            id: 'trending',
            name: 'Trending Audio/Challenge',
            description: 'Participate in viral trends',
            avgViews: '100K-5M',
            difficulty: 'Easy',
            examples: [
                'Dance challenges',
                'Lip sync trends',
                'Sound-specific challenges'
            ],
            tips: ['Jump on trends within 48hrs', 'Add your unique twist', 'Niche it down to your audience'],
            viralPotential: 70
        },
        {
            id: 'satisfying',
            name: 'Satisfying/ASMR',
            description: 'Visually or audibly satisfying content',
            avgViews: '500K-3M',
            difficulty: 'Medium',
            examples: [
                'Unboxings with good sounds',
                'Organizing/cleaning',
                'Making/creating process'
            ],
            tips: ['Good audio is essential', 'Slow motion works well', 'Show the process'],
            viralPotential: 85
        },
        {
            id: 'comparison',
            name: 'Comparison/VS',
            description: 'Compare two things side by side',
            avgViews: '300K-1M',
            difficulty: 'Easy',
            examples: [
                '$5 vs $500 challenge',
                'Cheap vs expensive comparison',
                'Expectation vs Reality'
            ],
            tips: ['Make the difference dramatic', 'Unexpected winner gets more engagement', 'Use split screen'],
            viralPotential: 80
        },
        {
            id: 'relatable',
            name: 'Relatable Content',
            description: 'Content your audience identifies with',
            avgViews: '200K-800K',
            difficulty: 'Easy',
            examples: [
                'Things only [niche] people understand',
                'When your mom/boss/friend does X',
                'Signs you are a [type of person]'
            ],
            tips: ['Know your audience deeply', 'Use shared experiences', 'Keep it light and funny'],
            viralPotential: 75
        },
    ],

    trendingConcepts: [
        { concept: 'Get Ready With Me (GRWM)', heat: 95, description: 'Show your routine while chatting' },
        { concept: 'Day in My Life', heat: 88, description: 'Document your typical day' },
        { concept: 'Mini Vlog', heat: 85, description: 'Quick lifestyle snippet' },
        { concept: 'Rating/Review', heat: 82, description: 'Give your opinion on things' },
        { concept: 'Whats in My Bag/Phone', heat: 78, description: 'Show your essentials' },
        { concept: 'Romanticize Your Life', heat: 92, description: 'Make mundane things aesthetic' },
        { concept: 'Silent Vlog', heat: 75, description: 'No talking, just vibes' },
        { concept: 'Haul', heat: 80, description: 'Show recent purchases' },
        { concept: 'Challenge Accepted', heat: 88, description: 'Do a viral challenge' },
        { concept: 'Reply to Comment', heat: 85, description: 'Respond to audience questions' },
    ],

    viralFormulas: [
        {
            name: 'The Hook Formula',
            structure: 'Hook (2s) → Context (5s) → Content (20s) → CTA (3s)',
            example: '"Stop scrolling" → "Heres why" → "The actual tip" → "Save for later"'
        },
        {
            name: 'The Loop Formula',
            structure: 'End connects to beginning seamlessly',
            example: 'Start mid-action, end at same point = infinite loop'
        },
        {
            name: 'The List Formula',
            structure: '"X things about Y" with quick cuts',
            example: '"5 red flags in dating" - rapid fire through each'
        },
        {
            name: 'The Reveal Formula',
            structure: 'Build up → Dramatic pause → Big reveal',
            example: 'Transformation videos, before/after'
        },
    ]
}

// Niche-specific reel ideas
const NICHE_REEL_IDEAS: Record<string, string[]> = {
    TECH: [
        'Hidden iPhone settings you need to enable',
        'AI tools that feel illegal to know',
        'Apps that will change your life',
        'Tech setup tour in 30 seconds',
        'Reacting to my old tech predictions'
    ],
    GAMING: [
        'When the random teammate carries',
        'My most insane clutch moment',
        'Rating my followers gaming setups',
        'POV: Last player alive',
        'Gaming setup evolution (first vs now)'
    ],
    FOOD: [
        'One pan dinner in 60 seconds',
        'Testing viral TikTok recipes',
        'Restaurant food I made at home',
        'My go-to lazy meal',
        'Rating fast food secret menus'
    ],
    FITNESS: [
        'Workout splits that actually work',
        '30 day transformation timelapse',
        'Exercises youre doing wrong',
        'My morning routine for gains',
        'Gym fails compilation'
    ],
    FASHION: [
        'One item styled 5 ways',
        'Thrift flip challenge',
        'Get ready with me for [event]',
        'Capsule wardrobe essentials',
        'Rating my followers outfits'
    ],
    ENTERTAINMENT: [
        'My hot takes tier list',
        'POV: You are a [character]',
        'If [show] characters were in 2024',
        'Unpopular opinions: [topic]',
        'Behind the scenes of my content'
    ],
    EDUCATION: [
        '3 facts about [topic] in 30 seconds',
        'Study with me but actually productive',
        'Things school didnt teach you',
        'Explaining [complex topic] simply',
        'Rate my study setup'
    ],
    TRAVEL: [
        'Hidden gems in [destination]',
        '48 hours in [city] challenge',
        'Travel hacks that save money',
        'Romanticizing my morning in [place]',
        'Packing my carry-on efficiently'
    ],
    BUSINESS: [
        'Side hustle that made me $X',
        'Business advice I wish I knew earlier',
        'Day in my life as an entrepreneur',
        'Reacting to my old business ideas',
        'Tools that 10x my productivity'
    ],
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')?.toUpperCase() || 'TECH'

    const nicheIdeas = NICHE_REEL_IDEAS[niche] || NICHE_REEL_IDEAS['TECH']

    return NextResponse.json({
        success: true,
        niche,
        formats: VIRAL_REELS.formats,
        trendingConcepts: VIRAL_REELS.trendingConcepts,
        viralFormulas: VIRAL_REELS.viralFormulas,
        nicheIdeas,
        updatedAt: new Date().toISOString()
    })
}
