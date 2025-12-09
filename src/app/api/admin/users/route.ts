import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Get Supabase admin client
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch all users with pagination
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = 20
        const offset = (page - 1) * limit
        const status = searchParams.get('status') || 'all'
        const industry = searchParams.get('industry') || 'all'

        const supabase = getSupabaseAdmin()

        // Build query
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        const { data: profiles, count, error } = await query

        if (error) throw error

        // Transform to expected format
        const users = (profiles || []).map((p: any) => ({
            id: p.id,
            email: p.email || 'N/A',
            name: p.full_name || p.name || 'Anonymous',
            avatar: (p.full_name || p.name || 'A').charAt(0).toUpperCase(),
            industry: p.industry || 'OTHER',
            location: p.location || 'IN',
            createdAt: p.created_at,
            lastActive: p.updated_at || p.created_at,
            status: p.is_banned ? 'banned' : (p.is_active !== false ? 'active' : 'inactive'),
            totalSearches: p.total_searches || 0,
            isAdmin: p.is_admin || false
        }))

        return NextResponse.json({
            success: true,
            users,
            totalPages: Math.ceil((count || 0) / limit),
            currentPage: page,
            totalUsers: count || 0
        })
    } catch (error: any) {
        console.error('Fetch users error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            users: [],
            totalPages: 1
        })
    }
}

// PATCH - Update user (ban/unban, make admin)
export async function PATCH(req: NextRequest) {
    try {
        const { userId, status, isAdmin } = await req.json()
        const supabase = getSupabaseAdmin()

        const updates: any = {}
        if (status !== undefined) {
            updates.is_banned = status === 'banned'
            updates.is_active = status === 'active'
        }
        if (isAdmin !== undefined) {
            updates.is_admin = isAdmin
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'User updated successfully'
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
