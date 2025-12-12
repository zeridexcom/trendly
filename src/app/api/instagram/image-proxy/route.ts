import { NextRequest } from 'next/server'

/**
 * Image proxy that fetches Instagram thumbnails and caches them
 * This bypasses CORS and Instagram's CDN expiration issues
 * 
 * GET /api/instagram/image-proxy?shortcode=ABC123
 */

// In-memory cache for images
const imageCache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const shortcode = searchParams.get('shortcode')

        if (!shortcode) {
            return Response.json({ error: 'shortcode required' }, { status: 400 })
        }

        const imageUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`

        // Check cache first
        const cached = imageCache.get(shortcode)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return new Response(cached.data, {
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
            return Response.json({
                error: 'Failed to fetch image',
                status: response.status
            }, { status: 502 })
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const arrayBuffer = await response.arrayBuffer()

        // Cache the image
        imageCache.set(shortcode, {
            data: arrayBuffer,
            contentType,
            timestamp: Date.now()
        })

        // Return the image
        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
                'X-Cache': 'MISS'
            }
        })

    } catch (error: any) {
        console.error('Image proxy error:', error)
        return Response.json({
            error: 'Proxy error',
            message: error.message
        }, { status: 500 })
    }
}
