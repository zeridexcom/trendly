import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - Fetch user's saved scripts
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const platform = searchParams.get('platform')
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('saved_scripts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (platform && platform !== 'all') {
            query = query.eq('platform', platform)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({
            success: true,
            scripts: data || [],
            count: data?.length || 0
        })

    } catch (error: any) {
        console.error('Fetch scripts error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// POST - Save a new script
export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            title,
            platform,
            ideaText,
            scriptContent,
            sourceVideoId,
            sourceVideoTitle,
            sourceVideoThumbnail
        } = body

        if (!title || !platform || !scriptContent) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: title, platform, scriptContent'
            }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('saved_scripts')
            .insert({
                user_id: userId,
                title,
                platform,
                idea_text: ideaText,
                script_content: scriptContent,
                source_video_id: sourceVideoId,
                source_video_title: sourceVideoTitle,
                source_video_thumbnail: sourceVideoThumbnail
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            script: data
        })

    } catch (error: any) {
        console.error('Save script error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// PATCH - Update a script (favorite, edit)
export async function PATCH(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Script ID required' }, { status: 400 })
        }

        // Convert camelCase to snake_case for DB
        const dbUpdates: Record<string, any> = {}
        if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite
        if (updates.title) dbUpdates.title = updates.title
        if (updates.scriptContent) dbUpdates.script_content = updates.scriptContent
        dbUpdates.updated_at = new Date().toISOString()

        const { data, error } = await supabase
            .from('saved_scripts')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            script: data
        })

    } catch (error: any) {
        console.error('Update script error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// DELETE - Delete a script
export async function DELETE(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Script ID required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('saved_scripts')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Script deleted'
        })

    } catch (error: any) {
        console.error('Delete script error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
