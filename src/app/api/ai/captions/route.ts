import { NextResponse } from 'next/server'
import { generateCaptions, generateHooks } from '@/lib/ai'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, postTitle, description, platform, goal, brandTone, brandName, topic } = body

        if (!type) {
            return NextResponse.json(
                { error: 'Type is required: "captions" or "hooks"' },
                { status: 400 }
            )
        }

        let result

        if (type === 'captions') {
            if (!postTitle || !platform || !goal) {
                return NextResponse.json(
                    { error: 'Missing required fields for captions: postTitle, platform, goal' },
                    { status: 400 }
                )
            }

            result = await generateCaptions({
                postTitle,
                description: description || '',
                platform,
                goal,
                brandTone,
                brandName,
            })

            return NextResponse.json({ captions: result })
        } else if (type === 'hooks') {
            if (!topic && !postTitle) {
                return NextResponse.json(
                    { error: 'Missing required field: topic or postTitle' },
                    { status: 400 }
                )
            }

            result = await generateHooks(topic || postTitle, platform || 'INSTAGRAM')
            return NextResponse.json({ hooks: result })
        }

        return NextResponse.json(
            { error: 'Invalid type. Use "captions" or "hooks"' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Caption/Hook generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        )
    }
}
