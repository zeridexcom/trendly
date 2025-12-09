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

-- Create admin user (run manually if needed)
-- INSERT INTO auth.users (email, encrypted_password, ...) VALUES ('admin@trendly.app', ...)
-- Note: Use Supabase Auth UI or API to create the admin user

-- ============================================
-- DONE!
-- ============================================
