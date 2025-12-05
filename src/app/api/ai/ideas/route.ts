import { NextResponse } from 'next/server'
import { generateIdeas } from '@/lib/ai'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { brandName, brandNiche, audienceDescription, platforms, goal, numberOfIdeas, brandTone } = body

        if (!brandName || !brandNiche || !audienceDescription || !platforms || !goal) {
            return NextResponse.json(
                { error: 'Missing required fields: brandName, brandNiche, audienceDescription, platforms, goal' },
                { status: 400 }
            )
        }

        const ideas = await generateIdeas({
            brandName,
            brandNiche,
            audienceDescription,
            platforms: Array.isArray(platforms) ? platforms : [platforms],
            goal,
            numberOfIdeas: numberOfIdeas || 5,
            brandTone,
        })

        return NextResponse.json({ ideas })
    } catch (error) {
        console.error('Idea generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate ideas' },
            { status: 500 }
        )
    }
}
