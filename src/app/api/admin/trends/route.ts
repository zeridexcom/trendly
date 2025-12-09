import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Get Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch custom trends
export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { data: trends, error } = await supabase
            .from('custom_trends')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            // Table might not exist, return empty
            return NextResponse.json({
                success: true,
                trends: []
            })
        }

        return NextResponse.json({
            success: true,
            trends: trends || []
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            trends: []
        })
    }
}

// POST - Create new custom trend
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const supabase = getSupabaseAdmin()

        const { data, error } = await supabase
            .from('custom_trends')
            .insert({
                title: body.title,
                traffic: body.traffic || 'Hot Topic',
                industry: body.industry || 'ALL',
                content_idea: body.contentIdea,
                reason: body.reason,
                is_active: body.isActive !== false,
                is_featured: body.isFeatured || false,
                created_by: 'Admin'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            trend: data
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// PATCH - Update custom trend
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, ...updates } = body
        const supabase = getSupabaseAdmin()

        // Transform field names
        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.traffic !== undefined) dbUpdates.traffic = updates.traffic
        if (updates.industry !== undefined) dbUpdates.industry = updates.industry
        if (updates.contentIdea !== undefined) dbUpdates.content_idea = updates.contentIdea
        if (updates.reason !== undefined) dbUpdates.reason = updates.reason
        if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured

        const { error } = await supabase
            .from('custom_trends')
            .update(dbUpdates)
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Trend updated'
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

// DELETE - Delete custom trend
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        const supabase = getSupabaseAdmin()

        const { error } = await supabase
            .from('custom_trends')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Trend deleted'
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
