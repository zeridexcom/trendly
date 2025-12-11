import { NextRequest, NextResponse } from 'next/server'

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com'

// Get Instagram user profile and media
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'profile'

    if (!INSTAGRAM_ACCESS_TOKEN) {
        return NextResponse.json({
            success: false,
            error: 'Instagram not configured'
        }, { status: 500 })
    }

    try {
        if (type === 'profile') {
            // Get user profile
            const profileResponse = await fetch(
                `${INSTAGRAM_GRAPH_URL}/me?fields=id,username,account_type,media_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`
            )
            const profile = await profileResponse.json()

            if (profile.error) {
                throw new Error(profile.error.message)
            }

            return NextResponse.json({
                success: true,
                profile
            })
        }

        if (type === 'media') {
            // Get user's media/posts
            const limit = searchParams.get('limit') || '20'
            const mediaResponse = await fetch(
                `${INSTAGRAM_GRAPH_URL}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`
            )
            const mediaData = await mediaResponse.json()

            if (mediaData.error) {
                throw new Error(mediaData.error.message)
            }

            // Format the media data
            const posts = mediaData.data?.map((post: any) => ({
                id: post.id,
                caption: post.caption || '',
                mediaType: post.media_type,
                mediaUrl: post.media_url || post.thumbnail_url,
                permalink: post.permalink,
                timestamp: post.timestamp,
                likes: post.like_count || 0,
                comments: post.comments_count || 0,
                engagement: post.like_count + post.comments_count
            })) || []

            return NextResponse.json({
                success: true,
                posts,
                pagination: mediaData.paging
            })
        }

        if (type === 'insights') {
            // Get account insights (requires business account)
            const insightsResponse = await fetch(
                `${INSTAGRAM_GRAPH_URL}/me/insights?metric=impressions,reach,profile_views&period=day&access_token=${INSTAGRAM_ACCESS_TOKEN}`
            )
            const insights = await insightsResponse.json()

            return NextResponse.json({
                success: true,
                insights: insights.data || []
            })
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid type parameter'
        }, { status: 400 })

    } catch (error: any) {
        console.error('Instagram API error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch Instagram data'
        }, { status: 500 })
    }
}
