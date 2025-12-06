import { NextRequest, NextResponse } from 'next/server'

// Types
interface CommentInput {
    id: string
    text: string
    username: string
    platform: string
    timestamp?: string
}

interface ReplyStyle {
    id: string
    name: string
    description: string
    emoji: string
}

interface GeneratedReply {
    id: string
    originalComment: CommentInput
    sentiment: 'positive' | 'negative' | 'neutral' | 'question' | 'spam'
    sentimentScore: number
    intent: string
    replies: {
        style: string
        text: string
        engagementScore: number
    }[]
    suggestedEmojis: string[]
    followUpQuestion?: string
}

// Reply styles
const replyStyles: ReplyStyle[] = [
    { id: 'friendly', name: 'Friendly', description: 'Warm and welcoming', emoji: '😊' },
    { id: 'professional', name: 'Professional', description: 'Polished and formal', emoji: '💼' },
    { id: 'witty', name: 'Witty', description: 'Clever and humorous', emoji: '😏' },
    { id: 'grateful', name: 'Grateful', description: 'Appreciation focused', emoji: '🙏' },
    { id: 'engaging', name: 'Engaging', description: 'Encourages conversation', emoji: '💬' },
    { id: 'casual', name: 'Casual', description: 'Laid-back and relaxed', emoji: '✌️' },
]

// Sentiment keywords
const sentimentPatterns = {
    positive: ['love', 'amazing', 'awesome', 'great', 'best', 'incredible', 'perfect', 'beautiful', 'fantastic', 'excellent', '❤️', '🔥', '💯', 'thanks', 'thank you'],
    negative: ['hate', 'bad', 'worst', 'terrible', 'awful', 'disappointed', 'annoying', 'boring', 'sucks', 'trash', 'fake', 'scam'],
    question: ['?', 'how', 'what', 'when', 'where', 'why', 'can you', 'could you', 'do you', 'is this', 'are you', 'will you'],
    spam: ['dm me', 'check my', 'follow me', 'click link', 'buy now', 'make money', 'free followers', 'check bio'],
}

// Intent detection
const intentPatterns = {
    compliment: ['love this', 'so good', 'amazing', 'beautiful', 'great job', 'well done', 'talented'],
    question: ['how do', 'what is', 'can you', 'could you', 'where did', 'when will'],
    request: ['please', 'can you make', 'would love to see', 'do more', 'can we'],
    support: ['keep going', 'you got this', 'proud of you', 'inspiring', 'motivation'],
    criticism: ['but', 'however', 'could be better', 'not great', 'disappointed'],
    collaboration: ['collab', 'work together', 'partner', 'dm me', 'let\'s connect'],
}

// Reply templates by sentiment and style
const replyTemplates = {
    positive: {
        friendly: [
            "Aww thank you so much! 🥰 This made my day!",
            "You're the sweetest! Thanks for the love! 💕",
            "This comment just made me smile so big! 😊",
            "YOU'RE amazing! Thanks for being here! ✨",
        ],
        professional: [
            "Thank you for your kind words! We really appreciate your support.",
            "We're grateful for feedback like this. Thank you!",
            "Your support means everything to us. Thank you!",
        ],
        witty: [
            "Stop, you're making me blush! 😏",
            "I'm not crying, you're crying! 🥹",
            "Okay but this comment? *Chef's kiss* 👨‍🍳💋",
        ],
        grateful: [
            "I can't thank you enough for this! Your support means the world 🙏",
            "This is why I do what I do. Thank YOU! 💖",
            "Comments like this keep me going. Truly grateful! 🙏✨",
        ],
        engaging: [
            "Thank you!! What's YOUR favorite part? I'd love to know! 👇",
            "You're too kind! What content do you want to see next? 💭",
            "This means so much! What brought you here today? 🤔",
        ],
        casual: [
            "Yooo thanks! 🔥",
            "Appreciate you! 🤙",
            "You're a real one! Thanks! 💯",
        ],
    },
    negative: {
        friendly: [
            "I'm sorry you feel that way! I'd love to do better - any suggestions? 💙",
            "Thanks for the honest feedback! Always looking to improve 🙏",
            "I hear you! What would you like to see instead? 💭",
        ],
        professional: [
            "We appreciate your feedback and take all comments seriously.",
            "Thank you for sharing your perspective. We're always improving.",
            "Your feedback is valuable. We'll take this into consideration.",
        ],
        witty: [
            "Noted! Adding this to my 'things to think about at 3am' list 😅",
            "Fair enough! Can't win 'em all 🤷‍♂️",
            "Oof, that one stung a little 😅 but I respect the honesty!",
        ],
        grateful: [
            "I appreciate you taking the time to share this. Feedback helps me grow! 🙏",
            "Thank you for your honesty - it's how I improve! 💙",
        ],
        engaging: [
            "I'd love to understand more! What specifically didn't work for you? 🤔",
            "Thanks for the feedback! How can I make this better for you? 💭",
        ],
        casual: [
            "No worries, can't please everyone! 🤙",
            "Fair enough! Thanks for watching though 🙏",
        ],
    },
    question: {
        friendly: [
            "Great question! [Answer here] Let me know if you need anything else! 😊",
            "Ooh love this question! [Answer here] Hope that helps! 💕",
        ],
        professional: [
            "Thank you for asking. [Answer here] Please don't hesitate to reach out with more questions.",
            "Great question. [Answer here] We're happy to help further.",
        ],
        witty: [
            "Ah, someone's asking the real questions! 😏 [Answer here]",
            "Okay I love that you asked this! [Answer here] 🔥",
        ],
        grateful: [
            "Thanks for asking! [Answer here] Let me know if you need anything else! 🙏",
        ],
        engaging: [
            "[Answer here] Does that help? Feel free to ask more! 💬",
            "[Answer here] What else would you like to know? 👇",
        ],
        casual: [
            "[Answer here] Hope that helps! 🤙",
            "Good question! [Answer here] ✌️",
        ],
    },
    neutral: {
        friendly: [
            "Thanks for stopping by! 😊✨",
            "Appreciate you being here! 💙",
            "Thanks for watching/reading! 🙏",
        ],
        professional: [
            "Thank you for your engagement.",
            "We appreciate your interest.",
        ],
        witty: [
            "Thanks for the comment! You're officially cool now 😎",
            "Appreciate you! *virtual high five* 🙌",
        ],
        grateful: [
            "Thank you for being part of this community! 🙏",
            "Your support means everything! 💖",
        ],
        engaging: [
            "Thanks! What did you think? I'd love to hear more! 👇",
            "Appreciate it! What would you like to see next? 💭",
        ],
        casual: [
            "Thanks! 🔥",
            "Appreciate it! 🤙",
        ],
    },
    spam: {
        friendly: ["Thanks for commenting! 😊"],
        professional: ["Thank you for your interest."],
        witty: ["Nice try! 😏"],
        grateful: ["Thanks! 🙏"],
        engaging: ["Thanks for being here!"],
        casual: ["🤙"],
    },
}

function detectSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral' | 'question' | 'spam'; score: number } {
    const lowerText = text.toLowerCase()

    // Check for spam first
    const spamMatches = sentimentPatterns.spam.filter(s => lowerText.includes(s))
    if (spamMatches.length >= 2) return { sentiment: 'spam', score: 0.9 }

    // Check for questions
    const questionMatches = sentimentPatterns.question.filter(s => lowerText.includes(s))
    if (questionMatches.length > 0 && lowerText.includes('?')) return { sentiment: 'question', score: 0.85 }

    // Check positive/negative
    const positiveMatches = sentimentPatterns.positive.filter(s => lowerText.includes(s))
    const negativeMatches = sentimentPatterns.negative.filter(s => lowerText.includes(s))

    if (positiveMatches.length > negativeMatches.length) {
        return { sentiment: 'positive', score: Math.min(0.95, 0.5 + positiveMatches.length * 0.1) }
    }
    if (negativeMatches.length > positiveMatches.length) {
        return { sentiment: 'negative', score: Math.min(0.95, 0.5 + negativeMatches.length * 0.1) }
    }

    return { sentiment: 'neutral', score: 0.6 }
}

function detectIntent(text: string): string {
    const lowerText = text.toLowerCase()

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
        const matches = patterns.filter(p => lowerText.includes(p))
        if (matches.length > 0) return intent
    }

    return 'general'
}

function generateReplies(comment: CommentInput): GeneratedReply {
    const { sentiment, score } = detectSentiment(comment.text)
    const intent = detectIntent(comment.text)

    const templates = replyTemplates[sentiment] || replyTemplates.neutral
    const replies = replyStyles.map(style => {
        const styleTemplates = templates[style.id as keyof typeof templates] || templates.friendly
        const randomTemplate = styleTemplates[Math.floor(Math.random() * styleTemplates.length)]

        return {
            style: style.id,
            text: randomTemplate,
            engagementScore: Math.floor(60 + Math.random() * 35),
        }
    })

    // Generate suggested emojis based on sentiment
    const emojiMap = {
        positive: ['❤️', '🙏', '🔥', '✨', '💕', '😊', '🥰'],
        negative: ['🙏', '💙', '💪', '🤝'],
        question: ['💡', '👇', '💬', '🤔'],
        neutral: ['👋', '✨', '🙏', '💙'],
        spam: ['👋'],
    }

    const suggestedEmojis = emojiMap[sentiment].slice(0, 4)

    // Generate optional follow-up question for engagement
    const followUpQuestions = [
        "What content would you like to see next?",
        "How did you find my page?",
        "What's your favorite type of content?",
        "Any requests for future posts?",
    ]

    return {
        id: comment.id,
        originalComment: comment,
        sentiment,
        sentimentScore: score,
        intent,
        replies,
        suggestedEmojis,
        followUpQuestion: sentiment !== 'spam' ? followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)] : undefined,
    }
}

// POST - Generate replies for comments
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const comments: CommentInput[] = body.comments || []

        if (comments.length === 0) {
            return NextResponse.json(
                { error: 'No comments provided' },
                { status: 400 }
            )
        }

        const results = comments.map(comment => generateReplies(comment))

        return NextResponse.json({
            success: true,
            total: results.length,
            results,
            replyStyles,
        })
    } catch (error) {
        console.error('Comments API Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate replies' },
            { status: 500 }
        )
    }
}

// GET - Return available reply styles
export async function GET() {
    return NextResponse.json({
        replyStyles,
        sentiments: ['positive', 'negative', 'neutral', 'question', 'spam'],
        platforms: ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook'],
    })
}
