import OpenAI from 'openai'

// Lazy initialization of OpenAI client to avoid build-time errors
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI | null {
    if (openaiClient) return openaiClient

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) return null

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

// Check if AI is available
export const isAIAvailable = () => {
    return !!(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY)
}

// ============================================
// DASHBOARD AI INSIGHTS
// ============================================

interface DashboardContext {
    activeTrends: number
    ideasInPipeline: number
    scheduledPosts: number
    publishedThisWeek: number
    topPlatforms: string[]
}

interface DailyInsight {
    greeting: string
    mainInsight: string
    tips: string[]
    focusArea: string
    actionItems: string[]
}

export async function generateDailyInsights(context: DashboardContext): Promise<DailyInsight> {
    const openai = getOpenAI()

    if (!openai) {
        return {
            greeting: "Good day! 👋",
            mainInsight: "Your content calendar is looking healthy. Keep up the momentum!",
            tips: [
                "Best posting times are typically 9 AM and 7 PM",
                "Video content is performing 40% better this week",
                "Consider repurposing your top posts from last month"
            ],
            focusArea: "Content consistency",
            actionItems: ["Review pending ideas", "Schedule tomorrow's posts", "Check trend updates"]
        }
    }

    const prompt = `You are an expert social media strategist AI assistant. Generate personalized daily insights for a content team.

Current Status:
- Active Trends Being Tracked: ${context.activeTrends}
- Ideas in Pipeline: ${context.ideasInPipeline}
- Scheduled Posts: ${context.scheduledPosts}
- Published This Week: ${context.publishedThisWeek}
- Top Platforms: ${context.topPlatforms.join(', ')}

Generate a JSON response with:
{
  "greeting": "A friendly, time-appropriate greeting with emoji",
  "mainInsight": "One key insight about their content strategy (2 sentences max)",
  "tips": ["3 actionable tips based on their current stats"],
  "focusArea": "One area they should focus on today",
  "actionItems": ["3 specific actions to take today"]
}

Be encouraging, specific, and data-driven.`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are Trendly AI, an expert social media strategist. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')

        // Try to parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON response')
    } catch (error) {
        console.error('AI Dashboard Insights Error:', error)
        return {
            greeting: "Welcome back! 🚀",
            mainInsight: "Your content pipeline is active. Focus on converting ideas to scheduled posts.",
            tips: ["Review trending topics daily", "Batch create content for efficiency", "Engage during peak hours: 9-11 AM"],
            focusArea: "Content velocity",
            actionItems: ["Check new trends", "Review scheduled content", "Plan next week's posts"]
        }
    }
}

// ============================================
// TRENDS AI ANALYSIS
// ============================================

interface TrendInput {
    title: string
    platform: string
    type: string
    description?: string
}

interface TrendAnalysis {
    score: number
    potential: 'HIGH' | 'MEDIUM' | 'LOW'
    insights: string[]
    contentIdeas: string[]
    bestTimeToPost: string
    predictedLifespan: string
    competitorActivity: string
}

export async function analyzeTrend(trend: TrendInput): Promise<TrendAnalysis> {
    const openai = getOpenAI()

    if (!openai) {
        return {
            score: 75,
            potential: 'MEDIUM',
            insights: [
                "This trend shows steady engagement patterns",
                "Early adoption could give you competitive advantage",
                "Consider adding your unique twist to stand out"
            ],
            contentIdeas: [
                "Create a tutorial using this trend",
                "Share a behind-the-scenes take",
                "Make a reaction or commentary video"
            ],
            bestTimeToPost: "9 AM - 11 AM or 7 PM - 9 PM",
            predictedLifespan: "2-3 weeks",
            competitorActivity: "Moderate - good opportunity"
        }
    }

    const prompt = `Analyze this social media trend for a content creator:

Trend: ${trend.title}
Platform: ${trend.platform}
Type: ${trend.type}
${trend.description ? `Description: ${trend.description}` : ''}

Respond with JSON:
{
  "score": (0-100 trend score based on virality potential),
  "potential": "HIGH" or "MEDIUM" or "LOW",
  "insights": ["3 key insights about this trend"],
  "contentIdeas": ["3 specific content ideas using this trend"],
  "bestTimeToPost": "Recommended posting time window",
  "predictedLifespan": "How long this trend will likely last",
  "competitorActivity": "Brief assessment of competition"
}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a trend analysis expert. Provide actionable insights. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON')
    } catch (error) {
        console.error('AI Trend Analysis Error:', error)
        return {
            score: 70,
            potential: 'MEDIUM',
            insights: ["Unable to analyze - using default insights", "Consider researching competitor usage", "Test with a small audience first"],
            contentIdeas: ["Tutorial format", "Reaction video", "Collaborative content"],
            bestTimeToPost: "Peak hours",
            predictedLifespan: "1-2 weeks",
            competitorActivity: "Unknown"
        }
    }
}

export async function discoverTrends(platforms: string[], niche?: string): Promise<Array<{ title: string, platform: string, type: string, reason: string }>> {
    const openai = getOpenAI()

    if (!openai) {
        return [
            { title: "AI-generated content trend", platform: platforms[0] || "INSTAGRAM", type: "MEME_FORMAT", reason: "High engagement with tech-savvy audiences" },
            { title: "Behind-the-scenes authenticity", platform: "TIKTOK", type: "VIDEO_STYLE", reason: "Users crave genuine, unpolished content" },
            { title: "Micro-storytelling in 15 seconds", platform: "INSTAGRAM", type: "VIDEO_STYLE", reason: "Short attention spans favor quick stories" }
        ]
    }

    const prompt = `Suggest 5 trending content opportunities for social media:
Platforms: ${platforms.join(', ')}
${niche ? `Niche: ${niche}` : ''}

Respond with JSON:
{"trends": [{"title": "Trend name", "platform": "Best platform", "type": "HASHTAG or SOUND_AUDIO or MEME_FORMAT or VIDEO_STYLE or CHALLENGE or TOPIC", "reason": "Why trending"}]}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a social media trends expert. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            return parsed.trends || []
        }
        return []
    } catch (error) {
        console.error('AI Discover Trends Error:', error)
        return []
    }
}

// ============================================
// IDEAS AI ENHANCEMENT
// ============================================

interface IdeaGenerationInput {
    brandName: string
    brandNiche: string
    audienceDescription: string
    platforms: string[]
    goal: string
    numberOfIdeas: number
    brandTone?: string
}

interface GeneratedIdea {
    title: string
    description: string
    suggestedPlatform: string
    suggestedFormat: string
    hook: string
    estimatedEngagement: string
    contentPillars: string[]
}

export async function generateIdeas(input: IdeaGenerationInput): Promise<GeneratedIdea[]> {
    const openai = getOpenAI()

    if (!openai) {
        return Array.from({ length: input.numberOfIdeas }, (_, i) => ({
            title: `Content Idea ${i + 1}: ${input.goal}`,
            description: `A creative approach to ${input.goal.toLowerCase()} for ${input.platforms[0] || 'social media'}`,
            suggestedPlatform: input.platforms[i % input.platforms.length] || 'INSTAGRAM',
            suggestedFormat: ['Reel', 'Carousel', 'Story', 'Single Image'][i % 4],
            hook: "Stop scrolling! This will change how you think about...",
            estimatedEngagement: "Medium-High",
            contentPillars: ["Value", "Entertainment", "Education"]
        }))
    }

    const prompt = `Generate ${input.numberOfIdeas} viral content ideas:

Brand: ${input.brandName}
Niche: ${input.brandNiche}
Audience: ${input.audienceDescription}
Platforms: ${input.platforms.join(', ')}
Goal: ${input.goal}
${input.brandTone ? `Tone: ${input.brandTone}` : ''}

Respond with JSON:
{"ideas": [{"title": "Catchy title (max 60 chars)", "description": "2-3 sentence concept", "suggestedPlatform": "Best platform", "suggestedFormat": "Reel/Story/Carousel/Single Image", "hook": "Attention-grabbing first line", "estimatedEngagement": "Low/Medium/High", "contentPillars": ["2-3 pillars"]}]}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a viral content strategist. Create scroll-stopping ideas. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            return parsed.ideas || []
        }
        return []
    } catch (error) {
        console.error('AI Idea Generation Error:', error)
        throw new Error('Failed to generate ideas')
    }
}

interface IdeaEnhancement {
    improvedTitle: string
    viralHooks: string[]
    captionSuggestions: string[]
    hashtagSuggestions: string[]
    callToAction: string
    bestPostingTime: string
}

export async function enhanceIdea(idea: { title: string, description: string, platform: string }): Promise<IdeaEnhancement> {
    const openai = getOpenAI()

    if (!openai) {
        return {
            improvedTitle: idea.title,
            viralHooks: [
                "Nobody talks about this, but...",
                "Here's what changed everything for me...",
                "Stop doing this if you want to grow..."
            ],
            captionSuggestions: [
                `${idea.title} 🔥 Save this for later! #trending`,
                `POV: You finally figured out ${idea.title.toLowerCase()} 💡`
            ],
            hashtagSuggestions: ["#trending", "#viral", "#tips", "#growth", "#contentcreator"],
            callToAction: "Save this post and share with someone who needs it! 📌",
            bestPostingTime: "Tuesday-Thursday, 11 AM or 7 PM"
        }
    }

    const prompt = `Enhance this content idea for maximum engagement:

Title: ${idea.title}
Description: ${idea.description}
Platform: ${idea.platform}

Respond with JSON:
{"improvedTitle": "More engaging version", "viralHooks": ["3 scroll-stopping lines"], "captionSuggestions": ["2 ready captions with emojis"], "hashtagSuggestions": ["5 relevant hashtags"], "callToAction": "Compelling CTA", "bestPostingTime": "Specific recommendation"}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a social media optimization expert. Maximize engagement. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON')
    } catch (error) {
        console.error('AI Enhance Idea Error:', error)
        return {
            improvedTitle: idea.title,
            viralHooks: ["Check this out!", "You need to see this", "Game changer alert"],
            captionSuggestions: ["Great content coming your way! 🚀"],
            hashtagSuggestions: ["#content", "#social", "#tips"],
            callToAction: "Like and share!",
            bestPostingTime: "Weekday mornings"
        }
    }
}

// ============================================
// CALENDAR AI OPTIMIZATION
// ============================================

interface CalendarContext {
    scheduledPosts: Array<{ date: string, platform: string, type: string }>
    contentSlots: Array<{ dayOfWeek: number, time: string, platform: string }>
    platforms: string[]
}

interface CalendarInsights {
    overallScore: number
    gapsIdentified: string[]
    recommendations: string[]
    optimalSchedule: Array<{ day: string, time: string, platform: string, reason: string }>
    contentMix: { current: Record<string, number>, recommended: Record<string, number> }
}

export async function analyzeCalendar(context: CalendarContext): Promise<CalendarInsights> {
    const openai = getOpenAI()

    if (!openai) {
        return {
            overallScore: 72,
            gapsIdentified: [
                "No content scheduled for weekends",
                "Missing video content on TikTok",
                "Low posting frequency on LinkedIn"
            ],
            recommendations: [
                "Add 2-3 weekend posts for higher engagement",
                "Balance content types across platforms",
                "Consider peak hours: 9-11 AM and 7-9 PM"
            ],
            optimalSchedule: [
                { day: "Monday", time: "9:00 AM", platform: "INSTAGRAM", reason: "High engagement start of week" },
                { day: "Wednesday", time: "12:00 PM", platform: "LINKEDIN", reason: "Lunch break browsing peak" },
                { day: "Friday", time: "7:00 PM", platform: "TIKTOK", reason: "Weekend mood content performs best" }
            ],
            contentMix: {
                current: { "Reel": 40, "Carousel": 30, "Story": 20, "Single": 10 },
                recommended: { "Reel": 50, "Carousel": 25, "Story": 15, "Single": 10 }
            }
        }
    }

    const prompt = `Analyze this content calendar:
Scheduled Posts: ${JSON.stringify(context.scheduledPosts.slice(0, 10))}
Content Slots: ${JSON.stringify(context.contentSlots)}
Platforms: ${context.platforms.join(', ')}

Respond with JSON:
{"overallScore": 0-100, "gapsIdentified": ["3 gaps"], "recommendations": ["3 tips"], "optimalSchedule": [{"day": "Day", "time": "HH:MM AM/PM", "platform": "PLATFORM", "reason": "Why"}], "contentMix": {"current": {}, "recommended": {}}}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a social media scheduling expert. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.6,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON')
    } catch (error) {
        console.error('AI Calendar Analysis Error:', error)
        return {
            overallScore: 65,
            gapsIdentified: ["Analysis unavailable"],
            recommendations: ["Maintain consistent posting schedule"],
            optimalSchedule: [],
            contentMix: { current: {}, recommended: {} }
        }
    }
}

export async function suggestPostTiming(platform: string, contentType: string, goal: string): Promise<{ suggestedTime: string, suggestedDay: string, reason: string, alternativeSlots: Array<{ day: string, time: string }>, expectedReach: string }> {
    const openai = getOpenAI()

    if (!openai) {
        return {
            suggestedTime: "10:00 AM",
            suggestedDay: "Tuesday",
            reason: "Historically high engagement for this platform and content type",
            alternativeSlots: [
                { day: "Wednesday", time: "7:00 PM" },
                { day: "Thursday", time: "12:00 PM" }
            ],
            expectedReach: "Above average - 20-30% higher than random timing"
        }
    }

    const prompt = `Suggest optimal posting time:
Platform: ${platform}
Content Type: ${contentType}
Goal: ${goal}

Respond with JSON:
{"suggestedTime": "HH:MM AM/PM", "suggestedDay": "Day", "reason": "Why", "alternativeSlots": [{"day": "Day", "time": "HH:MM AM/PM"}], "expectedReach": "Performance prediction"}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a social media timing expert. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON')
    } catch (error) {
        console.error('AI Post Timing Error:', error)
        return {
            suggestedTime: "9:00 AM",
            suggestedDay: "Wednesday",
            reason: "General peak engagement time",
            alternativeSlots: [],
            expectedReach: "Standard"
        }
    }
}

// ============================================
// CAPTION & HOOKS GENERATION  
// ============================================

interface CaptionInput {
    postTitle: string
    description: string
    platform: string
    goal: string
    brandTone?: string
    brandName?: string
}

export async function generateCaptions(input: CaptionInput): Promise<string[]> {
    const openai = getOpenAI()

    if (!openai) {
        return [
            `✨ ${input.postTitle} - Your sign to take action! Drop a 🔥 if you agree!`,
            `POV: You just discovered ${input.postTitle.toLowerCase()} 💫 Save this for later!`,
            `${input.postTitle} 👀 The secret nobody talks about... #trending`
        ]
    }

    const prompt = `Generate 5 engaging captions:
Title: ${input.postTitle}
Description: ${input.description}
Platform: ${input.platform}
Goal: ${input.goal}

Requirements: Include emojis, platform-optimized length, clear CTA.

Respond with JSON: {"captions": ["5 captions"]}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a viral copywriter. Create engaging captions. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]).captions || []
        }
        return [`${input.postTitle} 🔥 #trending`]
    } catch (error) {
        console.error('AI Caption Error:', error)
        return [`${input.postTitle} 🔥 #trending`]
    }
}

export async function generateHooks(topic: string, platform: string): Promise<string[]> {
    const openai = getOpenAI()

    if (!openai) {
        return [
            "Stop scrolling! This will change everything...",
            "Nobody talks about this, but it's crucial...",
            "Here's what I wish I knew sooner...",
            "The biggest mistake you're making right now...",
            "This one tip 10x'd my results..."
        ]
    }

    const prompt = `Generate 5 viral hooks for:
Topic: ${topic}
Platform: ${platform}

Requirements: Max 15 words each, create curiosity, emotionally triggering.

Respond with JSON: {"hooks": ["5 hooks"]}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You create viral hooks that stop scrolling. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.9,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response')
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]).hooks || []
        }
        return ["Check this out!", "You need to see this..."]
    } catch (error) {
        console.error('AI Hooks Error:', error)
        return ["Check this out!", "You need to see this..."]
    }
}

// Token estimation helper
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
}

// ============================================
// AI CONTENT REPURPOSING
// ============================================

interface RepurposedContent {
    twitter: { thread: string[]; singlePost: string }
    linkedin: string
    instagram: { caption: string; hashtags: string[] }
    tiktok: { script: string; hooks: string[] }
    youtubeShorts: { script: string; title: string }
}

export async function repurposeContent(
    originalContent: string,
    contentType: 'blog' | 'video' | 'podcast' | 'article' = 'blog'
): Promise<RepurposedContent> {
    const openai = getOpenAI()

    // Mock response for when AI is not available
    if (!openai) {
        return {
            twitter: {
                thread: [
                    "🧵 Here's something interesting I've been working on...",
                    "1/ The key insight is that consistency beats perfection every time.",
                    "2/ Focus on showing up daily rather than waiting for the perfect moment.",
                    "3/ Small wins compound into massive results over time.",
                    "4/ What's your take? Reply below 👇"
                ],
                singlePost: "✨ Key insight: Consistency beats perfection. Show up daily, focus on small wins, and watch them compound into massive results. What's your experience? 💬"
            },
            linkedin: `I've been reflecting on a key lesson lately.

The most successful people I know share one trait: unwavering consistency.

They don't wait for perfect conditions.
They don't need motivation every day.
They simply show up.

Here's what I've learned:
• Small actions daily > big actions occasionally
• Progress compounds faster than you expect
• Perfection is the enemy of progress

What habit has made the biggest difference in your career?

#Leadership #Growth #Productivity`,
            instagram: {
                caption: "✨ The secret to success isn't talent or luck—it's showing up every single day.\n\nConsistency beats perfection. Every. Single. Time.\n\nDouble tap if you agree 💫\n\nWhat's one habit you're committed to this week?",
                hashtags: ["#motivation", "#success", "#consistency", "#mindset", "#growthmindset", "#dailyhabits", "#productivity", "#entrepreneur"]
            },
            tiktok: {
                script: "[HOOK - 0:00] The one thing successful people never tell you...\n\n[CONTENT - 0:03] It's not about being the smartest or most talented.\n\nIt's about showing up EVERY. SINGLE. DAY.\n\nEven when you don't feel like it.\nEven when no one's watching.\nEven when progress feels slow.\n\n[CTA - 0:25] Follow for more real talk on success 🔥",
                hooks: [
                    "The one thing successful people never tell you...",
                    "I tried this for 30 days and here's what happened",
                    "Stop doing this if you want to succeed"
                ]
            },
            youtubeShorts: {
                script: "[0:00 - HOOK]\nWant to know the #1 secret to success that nobody talks about?\n\n[0:05 - CONTENT]\nIt's NOT talent. It's NOT luck.\nIt's consistency.\n\nThe most successful people show up every day, even when:\n- They don't feel motivated\n- No one is watching\n- Progress seems slow\n\n[0:45 - CTA]\nSmash that subscribe button for more tips like this!",
                title: "The #1 Success Secret Nobody Talks About 🔥"
            }
        }
    }

    const prompt = `You are an expert social media content strategist. Take the following ${contentType} content and repurpose it for multiple platforms.

ORIGINAL CONTENT:
${originalContent}

Generate optimized versions for each platform following their best practices:

1. TWITTER: Create a thread (4-5 tweets) AND a single standalone tweet (under 280 chars)
2. LINKEDIN: Professional tone, use line breaks, include a question for engagement
3. INSTAGRAM: Engaging caption with emojis, include 8 relevant hashtags
4. TIKTOK: Short video script with [HOOK], [CONTENT], [CTA] sections, plus 3 alternative hooks
5. YOUTUBE SHORTS: 60-second script with timestamps and a catchy title

Respond with JSON in this exact format:
{
    "twitter": {
        "thread": ["tweet1", "tweet2", "tweet3", "tweet4"],
        "singlePost": "single tweet under 280 chars"
    },
    "linkedin": "full linkedin post",
    "instagram": {
        "caption": "caption with emojis",
        "hashtags": ["hashtag1", "hashtag2", "..."]
    },
    "tiktok": {
        "script": "full script with sections",
        "hooks": ["hook1", "hook2", "hook3"]
    },
    "youtubeShorts": {
        "script": "60 second script",
        "title": "catchy title"
    }
}`

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a viral content strategist. Always respond with valid JSON only, no markdown.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 2000,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response from AI')

        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as RepurposedContent
        }
        throw new Error('Invalid JSON response')
    } catch (error) {
        console.error('AI Repurpose Error:', error)
        // Return mock data on error
        return repurposeContent(originalContent, contentType)
    }
}

