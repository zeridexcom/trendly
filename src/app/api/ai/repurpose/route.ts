import { NextRequest, NextResponse } from 'next/server'
import { repurposeContent } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const { content, contentType } = await request.json()

        if (!content || content.trim().length < 50) {
            return NextResponse.json(
                { error: 'Please provide at least 50 characters of content to repurpose.' },
                { status: 400 }
            )
        }

        const result = await repurposeContent(content, contentType || 'blog')

        return NextResponse.json(result)
    } catch (error) {
        console.error('Repurpose API error:', error)
        return NextResponse.json(
            { error: 'Failed to repurpose content. Please try again.' },
            { status: 500 }
        )
    }
}
