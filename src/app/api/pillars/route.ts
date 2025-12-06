import { NextRequest, NextResponse } from 'next/server'

// Types
interface ContentPillar {
    id: string
    name: string
    description: string
    color: string
    icon: string
    targetPercentage: number
    currentCount: number
    minPerWeek: number
    maxPerWeek: number
    performance: {
        avgEngagement: number
        trend: 'up' | 'down' | 'stable'
    }
}

interface PillarTemplate {
    id: string
    name: string
    description: string
    industry: string
    pillars: Omit<ContentPillar, 'id' | 'currentCount' | 'performance'>[]
}

// Industry templates
const pillarTemplates: PillarTemplate[] = [
    {
        id: 'creator',
        name: 'Content Creator',
        description: 'Perfect for YouTubers, TikTokers, and social media creators',
        industry: 'Creator',
        pillars: [
            { name: 'Educational', description: 'Tutorials, how-tos, tips & tricks', color: '#3B82F6', icon: '📚', targetPercentage: 30, minPerWeek: 2, maxPerWeek: 4 },
            { name: 'Entertainment', description: 'Fun content, trends, challenges', color: '#EC4899', icon: '🎬', targetPercentage: 25, minPerWeek: 2, maxPerWeek: 4 },
            { name: 'Personal/Story', description: 'Behind-the-scenes, vlogs, personal stories', color: '#8B5CF6', icon: '💭', targetPercentage: 20, minPerWeek: 1, maxPerWeek: 3 },
            { name: 'Promotional', description: 'Collabs, sponsorships, product content', color: '#F59E0B', icon: '📢', targetPercentage: 15, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'Community', description: 'Q&As, polls, fan interactions', color: '#10B981', icon: '👥', targetPercentage: 10, minPerWeek: 1, maxPerWeek: 2 },
        ]
    },
    {
        id: 'business',
        name: 'Business/Brand',
        description: 'For companies, startups, and professional brands',
        industry: 'Business',
        pillars: [
            { name: 'Value Content', description: 'Industry insights, tips, expertise', color: '#3B82F6', icon: '💡', targetPercentage: 35, minPerWeek: 3, maxPerWeek: 5 },
            { name: 'Product/Service', description: 'Features, demos, use cases', color: '#F59E0B', icon: '🎯', targetPercentage: 25, minPerWeek: 2, maxPerWeek: 3 },
            { name: 'Social Proof', description: 'Testimonials, case studies, results', color: '#10B981', icon: '⭐', targetPercentage: 20, minPerWeek: 1, maxPerWeek: 3 },
            { name: 'Culture/Team', description: 'Behind-the-scenes, team highlights', color: '#8B5CF6', icon: '🏢', targetPercentage: 15, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'News/Updates', description: 'Company updates, industry news', color: '#6B7280', icon: '📰', targetPercentage: 5, minPerWeek: 0, maxPerWeek: 2 },
        ]
    },
    {
        id: 'influencer',
        name: 'Lifestyle Influencer',
        description: 'For lifestyle, fashion, fitness, and travel influencers',
        industry: 'Influencer',
        pillars: [
            { name: 'Lifestyle', description: 'Day in life, routines, aesthetic content', color: '#EC4899', icon: '✨', targetPercentage: 30, minPerWeek: 2, maxPerWeek: 4 },
            { name: 'Tips & Advice', description: 'Recommendations, reviews, guides', color: '#3B82F6', icon: '💫', targetPercentage: 25, minPerWeek: 2, maxPerWeek: 3 },
            { name: 'Personal Stories', description: 'Authentic moments, struggles, wins', color: '#8B5CF6', icon: '📖', targetPercentage: 20, minPerWeek: 1, maxPerWeek: 3 },
            { name: 'Sponsored', description: 'Brand partnerships, affiliate content', color: '#F59E0B', icon: '🤝', targetPercentage: 15, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'Engagement', description: 'Challenges, trends, fan content', color: '#10B981', icon: '🔥', targetPercentage: 10, minPerWeek: 1, maxPerWeek: 2 },
        ]
    },
    {
        id: 'educator',
        name: 'Educator/Coach',
        description: 'For teachers, coaches, course creators, and consultants',
        industry: 'Education',
        pillars: [
            { name: 'Free Value', description: 'Tips, mini-lessons, quick wins', color: '#3B82F6', icon: '🎓', targetPercentage: 40, minPerWeek: 3, maxPerWeek: 5 },
            { name: 'Deep Dives', description: 'In-depth tutorials, comprehensive guides', color: '#8B5CF6', icon: '📊', targetPercentage: 25, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'Social Proof', description: 'Student results, testimonials', color: '#10B981', icon: '🏆', targetPercentage: 15, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'Personal Brand', description: 'Your story, expertise, credibility', color: '#EC4899', icon: '👤', targetPercentage: 10, minPerWeek: 1, maxPerWeek: 2 },
            { name: 'Offers', description: 'Course promos, services, CTAs', color: '#F59E0B', icon: '💰', targetPercentage: 10, minPerWeek: 1, maxPerWeek: 2 },
        ]
    }
]

// In-memory store (production would use database)
let userPillars: ContentPillar[] = []

// Calculate health score
function calculateHealthScore(pillars: ContentPillar[]): number {
    if (pillars.length === 0) return 0

    const totalContent = pillars.reduce((sum, p) => sum + p.currentCount, 0)
    if (totalContent === 0) return 50 // Neutral if no content yet

    let deviationSum = 0
    pillars.forEach(pillar => {
        const actualPercentage = (pillar.currentCount / totalContent) * 100
        const deviation = Math.abs(actualPercentage - pillar.targetPercentage)
        deviationSum += deviation
    })

    // Lower deviation = higher score
    const avgDeviation = deviationSum / pillars.length
    const score = Math.max(0, Math.min(100, 100 - (avgDeviation * 2)))

    return Math.round(score)
}

// GET - Fetch pillars and templates
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'templates') {
        return NextResponse.json({ templates: pillarTemplates })
    }

    const healthScore = calculateHealthScore(userPillars)
    const totalContent = userPillars.reduce((sum, p) => sum + p.currentCount, 0)

    // Calculate balance status for each pillar
    const pillarsWithStatus = userPillars.map(pillar => {
        const actualPercentage = totalContent > 0
            ? (pillar.currentCount / totalContent) * 100
            : 0
        const diff = actualPercentage - pillar.targetPercentage

        let status: 'balanced' | 'under' | 'over' = 'balanced'
        if (diff < -10) status = 'under'
        else if (diff > 10) status = 'over'

        return {
            ...pillar,
            actualPercentage: Math.round(actualPercentage),
            status,
            diff: Math.round(diff)
        }
    })

    return NextResponse.json({
        pillars: pillarsWithStatus,
        healthScore,
        totalContent,
        recommendation: healthScore >= 80
            ? 'Great job! Your content mix is well balanced.'
            : healthScore >= 50
                ? 'Consider posting more in your underrepresented pillars.'
                : 'Your content mix needs attention. Focus on diversifying.'
    })
}

// POST - Create pillars from template or custom
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (body.templateId) {
            // Apply template
            const template = pillarTemplates.find(t => t.id === body.templateId)
            if (!template) {
                return NextResponse.json({ error: 'Template not found' }, { status: 404 })
            }

            userPillars = template.pillars.map((p, i) => ({
                ...p,
                id: `pillar_${Date.now()}_${i}`,
                currentCount: 0,
                performance: {
                    avgEngagement: Math.floor(Math.random() * 5000) + 1000,
                    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
                }
            }))

            return NextResponse.json({
                success: true,
                message: `Applied "${template.name}" template with ${userPillars.length} pillars`,
                pillars: userPillars
            })
        }

        // Create custom pillar
        const newPillar: ContentPillar = {
            id: `pillar_${Date.now()}`,
            name: body.name,
            description: body.description || '',
            color: body.color || '#3B82F6',
            icon: body.icon || '📌',
            targetPercentage: body.targetPercentage || 20,
            currentCount: 0,
            minPerWeek: body.minPerWeek || 1,
            maxPerWeek: body.maxPerWeek || 5,
            performance: {
                avgEngagement: 0,
                trend: 'stable'
            }
        }

        userPillars.push(newPillar)

        return NextResponse.json({
            success: true,
            pillar: newPillar
        })
    } catch (error) {
        console.error('Pillars API Error:', error)
        return NextResponse.json({ error: 'Failed to create pillar' }, { status: 500 })
    }
}

// PUT - Update pillar
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const index = userPillars.findIndex(p => p.id === body.id)

        if (index === -1) {
            return NextResponse.json({ error: 'Pillar not found' }, { status: 404 })
        }

        userPillars[index] = { ...userPillars[index], ...body }

        return NextResponse.json({
            success: true,
            pillar: userPillars[index]
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update pillar' }, { status: 500 })
    }
}

// DELETE - Remove pillar
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Pillar ID required' }, { status: 400 })
    }

    userPillars = userPillars.filter(p => p.id !== id)

    return NextResponse.json({ success: true })
}
