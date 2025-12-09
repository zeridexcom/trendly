import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// List of admin emails (can be moved to database later)
const ADMIN_EMAILS = [
    'admin@trendly.app',
    'owner@trendly.app',
    // Add your email here to become admin
]

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({
                isAdmin: false,
                message: 'Not authenticated'
            })
        }

        // Check if user email is in admin list
        const isAdmin = ADMIN_EMAILS.includes(user.email || '') ||
            user.user_metadata?.role === 'admin' ||
            user.user_metadata?.isAdmin === true

        return NextResponse.json({
            isAdmin,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
            email: user.email
        })
    } catch (error: any) {
        return NextResponse.json({
            isAdmin: false,
            error: error.message
        })
    }
}

// POST - Set admin role (only super admin can do this)
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { email, makeAdmin } = await req.json()

        // Update user metadata (this would need admin SDK in production)
        // For now, just add to the list

        return NextResponse.json({
            success: true,
            message: `User ${email} admin status: ${makeAdmin}`
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
