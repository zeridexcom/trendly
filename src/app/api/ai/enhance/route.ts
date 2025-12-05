import { NextResponse } from 'next/server'
import { enhanceIdea, generateHooks } from '@/lib/ai'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { action, ...data } = body

        if (action === 'enhance') {
            const { title, description, platform } = data
            if (!title || !description || !platform) {
                return NextResponse.json(
                    { error: 'Missing required fields: title, description, platform' },
                    { status: 400 }
                )
            }
            const enhancement = await enhanceIdea({ title, description, platform })
            return NextResponse.json(enhancement)
        }

        if (action === 'hooks') {
            const { topic, platform } = data
            if (!topic || !platform) {
                return NextResponse.json(
                    { error: 'Missing required fields: topic, platform' },
                    { status: 400 }
                )
            }
            const hooks = await generateHooks(topic, platform)
            return NextResponse.json({ hooks })
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "enhance" or "hooks"' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Enhance idea error:', error)
        return NextResponse.json(
            { error: 'Failed to enhance idea' },
            { status: 500 }
        )
    }
}
