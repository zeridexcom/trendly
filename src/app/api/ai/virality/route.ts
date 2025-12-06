import { NextRequest, NextResponse } from 'next/server'

// Types
interface ViralityRequest {
    content: string
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin'
    contentType: 'caption' | 'script' | 'thread' | 'post'
    hashtags?: string[]
    targetAudience?: string
}

interface ScoreFactor {
    name: string
    score: number
    maxScore: number
    weight: number
    analysis: string
    suggestions: string[]
    icon: string
}

interface ViralityResult {
    overallScore: number
    grade: string
    gradeColor: string
    factors: ScoreFactor[]
    emotionalTriggers: { trigger: string; strength: number; color: string }[]
    hookAnalysis: {
        score: number
        type: string
        pattern: string
        improvements: string[]
    }
    readabilityScore: number
    predictedEngagement: {
        likes: string
        comments: string
        shares: string
        saves: string
    }
    competitorComparison: number
    bestTimeToPost: string
    aiSuggestions: {
        category: string
        original: string
        improved: string
        impact: string
    }[]
    trendAlignment: {
        matched: string[]
        suggested: string[]
    }
}

// Emotional trigger words database
const emotionalTriggers = {
    curiosity: ['secret', 'hidden', 'discover', 'revealed', 'truth', 'nobody', 'why', 'how', 'what if', 'mystery'],
    urgency: ['now', 'today', 'immediately', 'hurry', 'limited', 'last chance', 'before', 'deadline', 'ending soon'],
    fear: ['mistake', 'avoid', 'warning', 'danger', 'risk', 'never', 'stop', 'wrong', 'fail', 'lose'],
    excitement: ['amazing', 'incredible', 'unbelievable', 'mind-blowing', 'insane', 'crazy', 'epic', 'legendary'],
    trust: ['proven', 'research', 'study', 'expert', 'professional', 'certified', 'guaranteed', 'backed'],
    social_proof: ['everyone', 'millions', 'viral', 'trending', 'popular', 'famous', 'celebrity', 'influencer'],
    value: ['free', 'save', 'discount', 'bonus', 'exclusive', 'premium', 'worth', 'valuable'],
    personal: ['you', 'your', 'yourself', 'personal', 'custom', 'tailored', 'specific', 'unique'],
}

// Hook patterns database
const hookPatterns = {
    question: { pattern: /^(why|how|what|when|where|who|did you|have you|can you)/i, score: 85 },
    statistic: { pattern: /^\d+%|\d+ (out of|in)|\d+x/i, score: 90 },
    controversy: { pattern: /(unpopular opinion|hot take|controversial|nobody|most people)/i, score: 88 },
    story: { pattern: /(i |my |when i|last year|yesterday|this morning)/i, score: 82 },
    promise: { pattern: /(how to|ways to|steps to|guide|tutorial|learn)/i, score: 80 },
    shock: { pattern: /(stop|don't|never|warning|avoid|mistake)/i, score: 87 },
    listicle: { pattern: /^(\d+|top \d+|best \d+)/i, score: 75 },
    challenge: { pattern: /(challenge|try this|can you|bet you)/i, score: 83 },
}

// Platform-specific optimization
const platformOptimization = {
    instagram: { idealLength: { min: 100, max: 300 }, hashtagCount: { min: 5, max: 15 }, emojiWeight: 1.2 },
    tiktok: { idealLength: { min: 20, max: 100 }, hashtagCount: { min: 3, max: 5 }, emojiWeight: 1.5 },
    youtube: { idealLength: { min: 100, max: 500 }, hashtagCount: { min: 3, max: 5 }, emojiWeight: 0.8 },
    twitter: { idealLength: { min: 50, max: 280 }, hashtagCount: { min: 1, max: 3 }, emojiWeight: 1.0 },
    linkedin: { idealLength: { min: 150, max: 700 }, hashtagCount: { min: 3, max: 5 }, emojiWeight: 0.5 },
}

// Trending topics (mock - in production would be real-time)
const trendingTopics = [
    'AI', 'productivity', 'remote work', 'side hustle', 'mental health',
    'crypto', 'sustainability', 'personal branding', 'content creation',
    'entrepreneurship', 'minimalism', 'self improvement', 'tech layoffs'
]

function analyzeContent(request: ViralityRequest): ViralityResult {
    const { content, platform, contentType, hashtags = [] } = request
    const contentLower = content.toLowerCase()
    const words = content.split(/\s+/)
    const sentences = content.split(/[.!?]+/).filter(Boolean)
    const platformConfig = platformOptimization[platform]

    // Factor 1: Hook Strength
    let hookScore = 50
    let hookType = 'Generic'
    let hookPattern = 'No strong pattern detected'
    const firstSentence = sentences[0] || content.slice(0, 100)

    for (const [type, config] of Object.entries(hookPatterns)) {
        if (config.pattern.test(firstSentence)) {
            hookScore = config.score + Math.floor(Math.random() * 10)
            hookType = type.charAt(0).toUpperCase() + type.slice(1)
            hookPattern = `${type} hook pattern detected`
            break
        }
    }

    // Factor 2: Emotional Triggers
    const detectedTriggers: { trigger: string; strength: number; color: string }[] = []
    const triggerColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

    Object.entries(emotionalTriggers).forEach(([trigger, words], i) => {
        const found = words.filter(w => contentLower.includes(w.toLowerCase()))
        if (found.length > 0) {
            detectedTriggers.push({
                trigger: trigger.replace('_', ' '),
                strength: Math.min(100, found.length * 25 + 50),
                color: triggerColors[i % triggerColors.length]
            })
        }
    })

    const emotionScore = Math.min(100, detectedTriggers.length * 15 + 40)

    // Factor 3: Length Optimization
    const lengthScore = (() => {
        const len = content.length
        if (len >= platformConfig.idealLength.min && len <= platformConfig.idealLength.max) return 95
        if (len < platformConfig.idealLength.min) return Math.max(40, 95 - (platformConfig.idealLength.min - len) / 2)
        return Math.max(40, 95 - (len - platformConfig.idealLength.max) / 5)
    })()

    // Factor 4: Readability
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length)
    const readabilityScore = avgWordsPerSentence <= 15 ? 90 : avgWordsPerSentence <= 20 ? 75 : 55

    // Factor 5: Hashtag Optimization
    const hashtagScore = (() => {
        const count = hashtags.length
        if (count >= platformConfig.hashtagCount.min && count <= platformConfig.hashtagCount.max) return 90
        if (count < platformConfig.hashtagCount.min) return 60
        return 50
    })()

    // Factor 6: Emoji Usage
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/gu) || []).length
    const emojiScore = (() => {
        const ideal = platform === 'linkedin' ? 1 : platform === 'tiktok' ? 5 : 3
        if (Math.abs(emojiCount - ideal) <= 1) return 85
        if (emojiCount === 0 && platform !== 'linkedin') return 50
        return 65
    })()

    // Factor 7: CTA Strength
    const ctaPatterns = /follow|subscribe|like|comment|share|save|click|tap|swipe|link in bio|check out|learn more|dm me/i
    const ctaScore = ctaPatterns.test(content) ? 85 : 45

    // Factor 8: Trend Alignment
    const matchedTrends = trendingTopics.filter(t => contentLower.includes(t.toLowerCase()))
    const trendScore = Math.min(95, 50 + matchedTrends.length * 15)

    // Build factors array
    const factors: ScoreFactor[] = [
        {
            name: 'Hook Strength',
            score: hookScore,
            maxScore: 100,
            weight: 1.5,
            analysis: `${hookType} hook detected. First 3 seconds are crucial for retention.`,
            suggestions: hookScore < 80 ? ['Start with a question or bold statement', 'Use numbers or statistics', 'Create curiosity gap'] : [],
            icon: '🎣'
        },
        {
            name: 'Emotional Impact',
            score: emotionScore,
            maxScore: 100,
            weight: 1.3,
            analysis: `${detectedTriggers.length} emotional triggers found. Emotional content gets 2x more shares.`,
            suggestions: emotionScore < 70 ? ['Add urgency words', 'Include personal pronouns (you, your)', 'Create FOMO'] : [],
            icon: '❤️'
        },
        {
            name: 'Length Optimization',
            score: lengthScore,
            maxScore: 100,
            weight: 1.0,
            analysis: `${content.length} characters. Optimal for ${platform}: ${platformConfig.idealLength.min}-${platformConfig.idealLength.max}.`,
            suggestions: lengthScore < 80 ? [`Adjust to ${platformConfig.idealLength.min}-${platformConfig.idealLength.max} characters`] : [],
            icon: '📏'
        },
        {
            name: 'Readability',
            score: readabilityScore,
            maxScore: 100,
            weight: 0.8,
            analysis: `${avgWordsPerSentence.toFixed(1)} words per sentence. Short sentences = higher engagement.`,
            suggestions: readabilityScore < 80 ? ['Break long sentences', 'Use line breaks', 'Add bullet points'] : [],
            icon: '👁️'
        },
        {
            name: 'Hashtag Strategy',
            score: hashtagScore,
            maxScore: 100,
            weight: 0.9,
            analysis: `${hashtags.length} hashtags. Optimal: ${platformConfig.hashtagCount.min}-${platformConfig.hashtagCount.max}.`,
            suggestions: hashtagScore < 80 ? [`Use ${platformConfig.hashtagCount.min}-${platformConfig.hashtagCount.max} relevant hashtags`] : [],
            icon: '#️⃣'
        },
        {
            name: 'Visual Cues',
            score: emojiScore,
            maxScore: 100,
            weight: 0.7,
            analysis: `${emojiCount} emojis found. Emojis increase engagement by 25%.`,
            suggestions: emojiScore < 70 ? ['Add 2-3 relevant emojis', 'Use emojis as bullet points'] : [],
            icon: '✨'
        },
        {
            name: 'Call-to-Action',
            score: ctaScore,
            maxScore: 100,
            weight: 1.2,
            analysis: ctaScore > 70 ? 'Strong CTA detected!' : 'No clear CTA found.',
            suggestions: ctaScore < 70 ? ['Add a clear call-to-action', 'Tell viewers exactly what to do', 'Create urgency in CTA'] : [],
            icon: '🎯'
        },
        {
            name: 'Trend Alignment',
            score: trendScore,
            maxScore: 100,
            weight: 1.1,
            analysis: `${matchedTrends.length} trending topics matched.`,
            suggestions: trendScore < 70 ? ['Incorporate trending topics', 'Reference current events', 'Use trending sounds/formats'] : [],
            icon: '🔥'
        },
    ]

    // Calculate weighted overall score
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
    const weightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0)
    const overallScore = Math.round(weightedScore / totalWeight)

    // Determine grade
    const grades = [
        { min: 90, grade: 'S', color: '#10B981' },
        { min: 80, grade: 'A', color: '#22C55E' },
        { min: 70, grade: 'B', color: '#84CC16' },
        { min: 60, grade: 'C', color: '#EAB308' },
        { min: 50, grade: 'D', color: '#F97316' },
        { min: 0, grade: 'F', color: '#EF4444' },
    ]
    const gradeInfo = grades.find(g => overallScore >= g.min) || grades[grades.length - 1]

    // Generate AI suggestions
    const aiSuggestions = []
    if (hookScore < 85) {
        aiSuggestions.push({
            category: 'Hook',
            original: firstSentence.slice(0, 50) + '...',
            improved: `🔥 ${firstSentence.split(' ').slice(0, 3).join(' ')}... (This is the SECRET that...)`,
            impact: '+15% retention'
        })
    }
    if (ctaScore < 70) {
        aiSuggestions.push({
            category: 'CTA',
            original: 'No CTA',
            improved: 'Drop a "🔥" if this resonated! Follow for more.',
            impact: '+25% engagement'
        })
    }

    // Predicted engagement
    const baseEngagement = overallScore * 10
    const predictedEngagement = {
        likes: `${Math.floor(baseEngagement * (0.8 + Math.random() * 0.4))}-${Math.floor(baseEngagement * (1.2 + Math.random() * 0.5))}`,
        comments: `${Math.floor(baseEngagement * 0.05)}-${Math.floor(baseEngagement * 0.15)}`,
        shares: `${Math.floor(baseEngagement * 0.02)}-${Math.floor(baseEngagement * 0.08)}`,
        saves: `${Math.floor(baseEngagement * 0.03)}-${Math.floor(baseEngagement * 0.1)}`,
    }

    return {
        overallScore,
        grade: gradeInfo.grade,
        gradeColor: gradeInfo.color,
        factors,
        emotionalTriggers: detectedTriggers.length > 0 ? detectedTriggers : [{ trigger: 'neutral', strength: 30, color: '#9CA3AF' }],
        hookAnalysis: {
            score: hookScore,
            type: hookType,
            pattern: hookPattern,
            improvements: hookScore < 80 ? ['Start with "You won\'t believe..."', 'Use a number: "3 reasons why..."', 'Ask a question'] : ['Great hook!']
        },
        readabilityScore,
        predictedEngagement,
        competitorComparison: Math.floor(60 + Math.random() * 30),
        bestTimeToPost: platform === 'linkedin' ? '10:00 AM Tue-Thu' : platform === 'tiktok' ? '7:00 AM or 9:00 PM' : '11:00 AM Wed',
        aiSuggestions,
        trendAlignment: {
            matched: matchedTrends,
            suggested: trendingTopics.filter(t => !matchedTrends.includes(t)).slice(0, 3)
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ViralityRequest = await request.json()

        if (!body.content || body.content.trim().length < 10) {
            return NextResponse.json(
                { error: 'Content must be at least 10 characters' },
                { status: 400 }
            )
        }

        const result = analyzeContent(body)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Virality API Error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze content' },
            { status: 500 }
        )
    }
}
