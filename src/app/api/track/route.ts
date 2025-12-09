import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Get Supabase admin client for writes
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { action, details, page, searchQuery, searchType, industry, resultsCount } = body

        const supabaseAdmin = getSupabaseAdmin()

        // Get current user from session
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Track user activity
        if (action) {
            await supabaseAdmin.from('user_activity').insert({
                user_id: user?.id || null,
                user_email: user?.email || null,
                action,
                details: details || {},
                page: page || null,
                ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
                user_agent: req.headers.get('user-agent') || null
            })
        }

        // Track search specifically
        if (searchQuery) {
            await supabaseAdmin.from('search_logs').insert({
                user_id: user?.id || null,
                query: searchQuery,
                search_type: searchType || 'trends',
                industry: industry || null,
                results_count: resultsCount || 0
            })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Track activity error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// Log API usage (internal use)
export async function logApiUsage(apiType: string, endpoint: string, unitsUsed: number, responseTimeMs: number, success: boolean, errorMessage?: string) {
    try {
        const supabaseAdmin = getSupabaseAdmin()
        await supabaseAdmin.from('api_usage_logs').insert({
            api_type: apiType,
            endpoint,
            units_used: unitsUsed,
            response_time_ms: responseTimeMs,
            success,
            error_message: errorMessage || null
        })
    } catch (error) {
        console.error('Failed to log API usage:', error)
    }
}
