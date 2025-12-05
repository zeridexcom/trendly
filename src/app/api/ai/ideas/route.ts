import { NextResponse } from 'next/server'
import { generateIdeas, estimateTokens } from '@/lib/ai'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        // Check authentication
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            brandName,
            brandNiche,
            audienceDescription,
            platforms,
            goal,
            numberOfIdeas = 5,
            brandTone,
        } = body

        // Validate required fields
        if (!brandNiche || !audienceDescription || !platforms?.length || !goal) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Generate ideas using AI
        const ideas = await generateIdeas({
            brandName: brandName || 'Your Brand',
            brandNiche,
            audienceDescription,
            platforms,
            goal,
            numberOfIdeas: Math.min(numberOfIdeas, 20), // Cap at 20
            brandTone,
        })

        return NextResponse.json({
            success: true,
            ideas,
            count: ideas.length,
        })
    } catch (error) {
        console.error('AI idea generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate ideas. Please try again.' },
            { status: 500 }
        )
    }
}
