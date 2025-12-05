import { NextResponse } from 'next/server'
import { generateCaptions, generateHooks } from '@/lib/ai'
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
            type, // 'caption' or 'hooks'
            postTitle,
            description,
            platform,
            goal,
            brandTone,
            brandName,
        } = body

        // Validate required fields
        if (!type || !postTitle || !platform || !goal) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        let result: string[]

        if (type === 'caption') {
            result = await generateCaptions({
                postTitle,
                description: description || '',
                platform,
                goal,
                brandTone,
                brandName,
            })
        } else if (type === 'hooks') {
            result = await generateHooks({
                postTitle,
                description: description || '',
                platform,
                goal,
                brandTone,
            })
        } else {
            return NextResponse.json(
                { error: 'Invalid type. Use "caption" or "hooks"' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            type,
            suggestions: result,
        })
    } catch (error) {
        console.error('AI caption/hooks generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate content. Please try again.' },
            { status: 500 }
        )
    }
}
