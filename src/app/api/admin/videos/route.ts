import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Get Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch featured videos
export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { data: videos, error } = await supabase
            .from('featured_videos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ success: true, videos: [] })
        }

        return NextResponse.json({
            success: true,
            videos: (videos || []).map((v: any) => ({
                id: v.id,
                videoId: v.video_id,
                title: v.title,
                thumbnail: v.thumbnail,
                channelTitle: v.channel_title,
                viewCount: v.view_count,
                likeCount: v.like_count,
                industry: v.industry,
                isFeatured: v.is_featured,
                addedAt: v.created_at
            }))
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, videos: [] })
    }
}

// POST - Add video by URL/ID
export async function POST(req: NextRequest) {
    try {
        const { videoId, industry = 'ALL' } = await req.json()
        const supabase = getSupabaseAdmin()

        // Fetch video details from YouTube API
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        let videoData: any = {
            video_id: videoId,
            title: 'Video ' + videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            channel_title: 'Unknown',
            view_count: 0,
            like_count: 0,
            industry: industry,
            is_featured: false
        }

        if (YOUTUBE_API_KEY) {
            try {
                const ytResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
                )
                const ytData = await ytResponse.json()

                if (ytData.items && ytData.items.length > 0) {
                    const item = ytData.items[0]
                    videoData = {
                        video_id: videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
                        channel_title: item.snippet.channelTitle,
                        view_count: parseInt(item.statistics.viewCount) || 0,
                        like_count: parseInt(item.statistics.likeCount) || 0,
                        industry: industry,
                        is_featured: false
                    }
                }
            } catch (ytError) {
                console.error('YouTube API error:', ytError)
            }
        }

        const { data, error } = await supabase
            .from('featured_videos')
            .insert(videoData)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            video: {
                id: data.id,
                videoId: data.video_id,
                title: data.title,
                thumbnail: data.thumbnail,
                channelTitle: data.channel_title,
                viewCount: data.view_count,
                likeCount: data.like_count,
                industry: data.industry,
                isFeatured: data.is_featured,
                addedAt: data.created_at
            }
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// PATCH - Update video (feature toggle)
export async function PATCH(req: NextRequest) {
    try {
        const { id, isFeatured, industry } = await req.json()
        const supabase = getSupabaseAdmin()

        const updates: any = {}
        if (isFeatured !== undefined) updates.is_featured = isFeatured
        if (industry !== undefined) updates.industry = industry

        const { error } = await supabase
            .from('featured_videos')
            .update(updates)
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// DELETE - Remove video
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        const supabase = getSupabaseAdmin()

        const { error } = await supabase
            .from('featured_videos')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
