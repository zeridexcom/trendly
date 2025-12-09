import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch app settings
export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseAdmin()

        const { data, error } = await supabase
            .from('app_settings')
            .select('*')
            .eq('id', 'main')
            .single()

        if (error || !data) {
            // Return defaults if no settings exist
            return NextResponse.json({
                success: true,
                settings: {
                    siteName: 'Trendly',
                    siteDescription: 'Discover trending content for your niche',
                    maintenanceMode: false,
                    allowRegistration: true,
                    defaultIndustry: 'TECH',
                    cacheRefreshHour: 0,
                    enableEmailNotifications: true,
                    adminEmail: 'admin@trendly.app',
                    youtubeApiKey: process.env.YOUTUBE_API_KEY ? '****' + process.env.YOUTUBE_API_KEY.slice(-8) : '',
                    serpApiKey: process.env.SERPAPI_KEY ? '****' + process.env.SERPAPI_KEY.slice(-8) : '',
                    openRouterApiKey: process.env.OPENROUTER_API_KEY ? '****' + process.env.OPENROUTER_API_KEY.slice(-8) : ''
                }
            })
        }

        return NextResponse.json({
            success: true,
            settings: {
                siteName: data.site_name,
                siteDescription: data.site_description,
                maintenanceMode: data.maintenance_mode,
                allowRegistration: data.allow_registration,
                defaultIndustry: data.default_industry,
                cacheRefreshHour: data.cache_refresh_hour,
                enableEmailNotifications: data.enable_email_notifications,
                adminEmail: data.admin_email,
                youtubeApiKey: '****' + (data.youtube_api_key || '').slice(-8),
                serpApiKey: '****' + (data.serp_api_key || '').slice(-8),
                openRouterApiKey: '****' + (data.openrouter_api_key || '').slice(-8)
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        })
    }
}

// POST - Save app settings
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const supabase = getSupabaseAdmin()

        const settings = {
            id: 'main',
            site_name: body.siteName,
            site_description: body.siteDescription,
            maintenance_mode: body.maintenanceMode,
            allow_registration: body.allowRegistration,
            default_industry: body.defaultIndustry,
            cache_refresh_hour: body.cacheRefreshHour,
            enable_email_notifications: body.enableEmailNotifications,
            admin_email: body.adminEmail,
            updated_at: new Date().toISOString()
        }

        // Only update API keys if they don't start with **** (meaning user entered a new key)
        if (body.youtubeApiKey && !body.youtubeApiKey.startsWith('****')) {
            (settings as any).youtube_api_key = body.youtubeApiKey
        }
        if (body.serpApiKey && !body.serpApiKey.startsWith('****')) {
            (settings as any).serp_api_key = body.serpApiKey
        }
        if (body.openRouterApiKey && !body.openRouterApiKey.startsWith('****')) {
            (settings as any).openrouter_api_key = body.openRouterApiKey
        }

        const { error } = await supabase
            .from('app_settings')
            .upsert(settings)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
