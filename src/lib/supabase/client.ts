import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy client during build time
        console.warn('Supabase env vars not available during build')
        return null as any
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
