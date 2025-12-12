import { NextRequest, NextResponse } from 'next/server'

/**
 * Image proxy that fetches Instagram thumbnails and caches them
 * This bypasses CORS and Instagram's CDN expiration issues
 * 
 * GET /api/instagram/image-proxy?url=ENCODED_URL
 * GET /api/instagram/image-proxy?shortcode=ABC123
 */

// In-memory cache for images (in production, use Redis or similar)
const imageCache = new Map<string, { data: Uint8Array; contentType: string; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        let imageUrl = searchParams.get('url')
        const shortcode = searchParams.get('shortcode')

        // If shortcode provided, try Instagram's media endpoint
        if (shortcode && !imageUrl) {
            imageUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`
        }

        if (!imageUrl) {
            return NextResponse.json({ error: 'url or shortcode required' }, { status: 400 })
        }

        // Check cache first
        const cacheKey = imageUrl
        const cached = imageCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return new NextResponse(cached.data, {
                headers: {
                    'Content-Type': cached.contentType,
                    'Cache-Control': 'public, max-age=86400',
                    'X-Cache': 'HIT'
                }
            })
        }

        // Fetch the image with proper headers
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.instagram.com/',
            },
            redirect: 'follow'
        })

        if (!response.ok) {
            return NextResponse.json({
                error: 'Failed to fetch image',
                status: response.status
            }, { status: 502 })
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const arrayBuffer = await response.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // Cache the image
        imageCache.set(cacheKey, {
            data: uint8Array,
            contentType,
            timestamp: Date.now()
        })

        // Return the image
        return new NextResponse(uint8Array, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
                'X-Cache': 'MISS'
            }
        })

    } catch (error: any) {
        console.error('Image proxy error:', error)
        return NextResponse.json({
            error: 'Proxy error',
            message: error.message
        }, { status: 500 })
    }
}
