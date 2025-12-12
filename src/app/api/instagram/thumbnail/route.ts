import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy to get fresh Instagram thumbnails using oEmbed API
 * GET /api/instagram/thumbnail?shortcode=ABC123
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const shortcode = searchParams.get('shortcode')

        if (!shortcode) {
            return NextResponse.json({ error: 'shortcode is required' }, { status: 400 })
        }

        const postUrl = `https://www.instagram.com/p/${shortcode}/`

        // Use Instagram's public oEmbed endpoint
        const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(postUrl)}`

        const response = await fetch(oembedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            // Return a placeholder image URL if oEmbed fails
            return NextResponse.json({
                success: false,
                thumbnail: null,
                error: 'Could not fetch thumbnail'
            })
        }

        const data = await response.json()

        return NextResponse.json({
            success: true,
            thumbnail: data.thumbnail_url,
            title: data.title,
            author: data.author_name
        })

    } catch (error: any) {
        console.error('Thumbnail fetch error:', error)
        return NextResponse.json({
            success: false,
            thumbnail: null,
            error: error.message
        }, { status: 500 })
    }
}
