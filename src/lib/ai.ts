import OpenAI from 'openai'

// Initialize OpenAI client only if API key is available
// This allows the build to succeed without the API key
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

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
}

interface CaptionInput {
    postTitle: string
    description: string
    platform: string
    goal: string
    brandTone?: string
    brandName?: string
}

interface HookInput {
    postTitle: string
    description: string
    platform: string
    goal: string
    brandTone?: string
}

// Generate content ideas using AI
export async function generateIdeas(input: IdeaGenerationInput): Promise<GeneratedIdea[]> {
    if (!openai) {
        // Return mock ideas when API key is not set
        return [
            {
                title: 'Behind the Scenes Content',
                description: 'Show your audience what happens behind the scenes. Authenticity builds trust and engagement.',
                suggestedPlatform: input.platforms[0] || 'INSTAGRAM',
                suggestedFormat: 'Reel',
            },
            {
                title: 'User Testimonial Feature',
                description: 'Feature real customer stories and testimonials to build social proof.',
                suggestedPlatform: input.platforms[0] || 'INSTAGRAM',
                suggestedFormat: 'Carousel',
            },
        ]
    }

    const prompt = `You are a creative social media strategist. Generate ${input.numberOfIdeas} unique content ideas for the following:

Brand: ${input.brandName}
Niche: ${input.brandNiche}
Target Audience: ${input.audienceDescription}
Platforms: ${input.platforms.join(', ')}
Goal: ${input.goal}
${input.brandTone ? `Brand Tone: ${input.brandTone}` : ''}

For each idea, provide:
1. A catchy title (max 60 characters)
2. A brief description (2-3 sentences explaining the concept)
3. The best platform for this content
4. The suggested format (Reel, Story, Carousel, Single Image, Short, Text Post, Thread)

Respond in JSON format as an array of objects with keys: title, description, suggestedPlatform, suggestedFormat

Make the ideas creative, trending, and aligned with current social media best practices.`

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative social media content strategist. Always respond with valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response from AI')

        const parsed = JSON.parse(content)
        return parsed.ideas || parsed
    } catch (error) {
        console.error('AI Idea Generation Error:', error)
        throw new Error('Failed to generate ideas')
    }
}

// Generate caption suggestions
export async function generateCaptions(input: CaptionInput): Promise<string[]> {
    if (!openai) {
        // Return mock captions when API key is not set
        return [
            `✨ ${input.postTitle} - Ready to transform your feed! Drop a 🔥 if you agree!`,
            `This is the sign you've been waiting for 👀 ${input.postTitle} #trending`,
            `POV: You just discovered the best ${input.platform.toLowerCase()} content 💫`,
        ]
    }

    const prompt = `Generate 5 engaging social media captions for the following post:

Title: ${input.postTitle}
Description: ${input.description}
Platform: ${input.platform}
Goal: ${input.goal}
${input.brandTone ? `Brand Tone: ${input.brandTone}` : ''}
${input.brandName ? `Brand: ${input.brandName}` : ''}

Requirements:
- Each caption should be unique and engaging
- Include relevant emojis
- Add a clear call-to-action where appropriate
- Optimize for ${input.platform}'s best practices
- Keep captions appropriate length for ${input.platform}

Respond in JSON format with key "captions" containing an array of 5 caption strings.`

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a social media copywriter. Create engaging, platform-optimized captions. Always respond with valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response from AI')

        const parsed = JSON.parse(content)
        return parsed.captions || []
    } catch (error) {
        console.error('AI Caption Generation Error:', error)
        throw new Error('Failed to generate captions')
    }
}

// Generate hook/first-line suggestions
export async function generateHooks(input: HookInput): Promise<string[]> {
    if (!openai) {
        // Return mock hooks when API key is not set
        return [
            'Stop scrolling! This will change everything...',
            'Nobody talks about this, but it matters...',
            'The secret that top creators won\'t tell you...',
        ]
    }

    const prompt = `Generate 5 attention-grabbing hooks/opening lines for a social media post:

Title: ${input.postTitle}
Description: ${input.description}
Platform: ${input.platform}
Goal: ${input.goal}
${input.brandTone ? `Brand Tone: ${input.brandTone}` : ''}

Requirements:
- Each hook should immediately grab attention
- Use power words and emotional triggers
- Create curiosity or urgency
- Be concise (max 15 words each)
- Optimized for ${input.platform}

Respond in JSON format with key "hooks" containing an array of 5 hook strings.`

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a viral content specialist. Create scroll-stopping hooks. Always respond with valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No response from AI')

        const parsed = JSON.parse(content)
        return parsed.hooks || []
    } catch (error) {
        console.error('AI Hook Generation Error:', error)
        throw new Error('Failed to generate hooks')
    }
}

// Get token usage estimate (for logging)
export function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
}
