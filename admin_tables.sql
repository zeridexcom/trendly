-- ============================================
-- ADMIN PANEL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Table: Custom Trends (admin-posted trends)
CREATE TABLE IF NOT EXISTS custom_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    traffic TEXT DEFAULT 'Hot Topic',
    industry TEXT DEFAULT 'ALL',
    content_idea TEXT,
    reason TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_custom_trends_industry ON custom_trends(industry);
CREATE INDEX IF NOT EXISTS idx_custom_trends_active ON custom_trends(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_trends_featured ON custom_trends(is_featured);

-- Table: Featured Videos (admin-pinned videos)
CREATE TABLE IF NOT EXISTS featured_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    thumbnail TEXT,
    channel_title TEXT,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    industry TEXT DEFAULT 'ALL',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_featured_videos_industry ON featured_videos(industry);
CREATE INDEX IF NOT EXISTS idx_featured_videos_featured ON featured_videos(is_featured);

-- Add admin columns to profiles table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_banned') THEN
        ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_searches') THEN
        ALTER TABLE profiles ADD COLUMN total_searches INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE custom_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;

-- Policies for custom_trends
CREATE POLICY "Allow public read on custom_trends" ON custom_trends
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow service role full access on custom_trends" ON custom_trends
    FOR ALL USING (auth.role() = 'service_role');

-- Policies for featured_videos
CREATE POLICY "Allow public read on featured_videos" ON featured_videos
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access on featured_videos" ON featured_videos
    FOR ALL USING (auth.role() = 'service_role');

-- Table: System Logs (for admin log viewer)
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success', 'debug')),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    details TEXT
);

-- Index for logs
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);

-- Table: App Settings (for admin settings page)
CREATE TABLE IF NOT EXISTS app_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_name TEXT DEFAULT 'Trendly',
    site_description TEXT DEFAULT 'Discover trending content for your niche',
    maintenance_mode BOOLEAN DEFAULT false,
    allow_registration BOOLEAN DEFAULT true,
    default_industry TEXT DEFAULT 'TECH',
    cache_refresh_hour INTEGER DEFAULT 0,
    enable_email_notifications BOOLEAN DEFAULT true,
    admin_email TEXT DEFAULT 'admin@trendly.app',
    youtube_api_key TEXT,
    serp_api_key TEXT,
    openrouter_api_key TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (id) VALUES ('main') ON CONFLICT DO NOTHING;

-- RLS for system_logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on system_logs" ON system_logs
    FOR ALL USING (auth.role() = 'service_role');

-- RLS for app_settings  
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on app_settings" ON app_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Create admin user (run manually if needed)
-- INSERT INTO auth.users (email, encrypted_password, ...) VALUES ('admin@trendly.app', ...)
-- Note: Use Supabase Auth UI or API to create the admin user

-- ============================================
-- DONE!
-- ============================================
