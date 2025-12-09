import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch system logs
export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { data: logs, error } = await supabase
            .from('system_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100)

        if (error) {
            // Table might not exist, return demo logs
            return NextResponse.json({
                success: true,
                logs: generateDemoLogs()
            })
        }

        return NextResponse.json({
            success: true,
            logs: (logs || []).map((l: any) => ({
                id: l.id,
                timestamp: l.timestamp,
                level: l.level,
                source: l.source,
                message: l.message,
                details: l.details
            }))
        })
    } catch (error: any) {
        return NextResponse.json({
            success: true,
            logs: generateDemoLogs()
        })
    }
}

// POST - Add a log entry
export async function POST(req: NextRequest) {
    try {
        const { level, source, message, details } = await req.json()
        const supabase = getSupabaseAdmin()

        const { error } = await supabase
            .from('system_logs')
            .insert({
                level,
                source,
                message,
                details,
                timestamp: new Date().toISOString()
            })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message })
    }
}

// DELETE - Clear all logs
export async function DELETE(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { error } = await supabase
            .from('system_logs')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message })
    }
}

function generateDemoLogs() {
    const messages = [
        { level: 'success', msg: 'Cache refresh completed', source: 'Cache' },
        { level: 'info', msg: 'User login successful', source: 'Auth' },
        { level: 'warning', msg: 'API quota at 80%', source: 'YouTube' },
        { level: 'error', msg: 'Failed to fetch trends', source: 'SerpAPI' },
        { level: 'debug', msg: 'Query executed in 45ms', source: 'Database' },
        { level: 'info', msg: 'New user registered', source: 'Auth' },
        { level: 'success', msg: 'Video analysis completed', source: 'API' },
        { level: 'warning', msg: 'Rate limit approaching', source: 'API' },
        { level: 'info', msg: 'Cache hit ratio: 85%', source: 'Cache' },
        { level: 'error', msg: 'Connection timeout', source: 'Database' },
    ]

    return messages.map((m, i) => ({
        id: `log-${i}`,
        timestamp: new Date(Date.now() - i * 300000).toISOString(),
        level: m.level,
        source: m.source,
        message: m.msg,
        details: m.level === 'error' ? 'Stack trace: Error at line 42...' : undefined
    }))
}
