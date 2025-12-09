-- ============================================
-- TRENDLY COMPLETE DATABASE SETUP (FIXED)
-- Copy this ENTIRE file and paste in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: CACHE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS cached_google_trends (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    traffic TEXT,
    formatted_traffic TEXT,
    related_queries TEXT[],
    industry TEXT,
    relevance_score INTEGER DEFAULT 90,
    reason TEXT,
    content_idea TEXT,
    source TEXT DEFAULT 'Google Trends',
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_cached_google_trends_industry ON cached_google_trends(industry);
CREATE INDEX IF NOT EXISTS idx_cached_google_trends_expires ON cached_google_trends(expires_at);

CREATE TABLE IF NOT EXISTS cached_youtube_videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    channel_title TEXT,
    published_at TIMESTAMPTZ,
    view_count BIGINT,
    like_count BIGINT,
    comment_count BIGINT,
    formatted_views TEXT,
    formatted_likes TEXT,
    formatted_comments TEXT,
    formatted_duration TEXT,
    engagement_rate TEXT,
    category_name TEXT,
    tags TEXT[],
    url TEXT,
    industry TEXT,
    days_ago INTEGER,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_industry ON cached_youtube_videos(industry);
CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_expires ON cached_youtube_videos(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_views ON cached_youtube_videos(view_count DESC);

CREATE TABLE IF NOT EXISTS cache_metadata (
    id TEXT PRIMARY KEY DEFAULT 'main',
    last_google_refresh TIMESTAMPTZ,
    last_youtube_refresh TIMESTAMPTZ,
    google_trends_count INTEGER DEFAULT 0,
    youtube_videos_count INTEGER DEFAULT 0,
    refresh_status TEXT DEFAULT 'idle',
    last_error TEXT
);

INSERT INTO cache_metadata (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 2: ADMIN TABLES
-- ============================================

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

CREATE INDEX IF NOT EXISTS idx_custom_trends_industry ON custom_trends(industry);
CREATE INDEX IF NOT EXISTS idx_custom_trends_active ON custom_trends(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_trends_featured ON custom_trends(is_featured);

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

CREATE INDEX IF NOT EXISTS idx_featured_videos_industry ON featured_videos(industry);
CREATE INDEX IF NOT EXISTS idx_featured_videos_featured ON featured_videos(is_featured);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success', 'debug')),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    details TEXT
);

CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);

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

INSERT INTO app_settings (id) VALUES ('main') ON CONFLICT DO NOTHING;

-- ============================================
-- PART 3: ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE cached_google_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on cached_google_trends" ON cached_google_trends;
DROP POLICY IF EXISTS "Allow public read on cached_youtube_videos" ON cached_youtube_videos;
DROP POLICY IF EXISTS "Allow public read on cache_metadata" ON cache_metadata;
DROP POLICY IF EXISTS "Allow public read on custom_trends" ON custom_trends;
DROP POLICY IF EXISTS "Allow public read on featured_videos" ON featured_videos;
DROP POLICY IF EXISTS "Allow service role write on cached_google_trends" ON cached_google_trends;
DROP POLICY IF EXISTS "Allow service role write on cached_youtube_videos" ON cached_youtube_videos;
DROP POLICY IF EXISTS "Allow service role write on cache_metadata" ON cache_metadata;
DROP POLICY IF EXISTS "Allow service role full access on custom_trends" ON custom_trends;
DROP POLICY IF EXISTS "Allow service role full access on featured_videos" ON featured_videos;
DROP POLICY IF EXISTS "Allow service role full access on system_logs" ON system_logs;
DROP POLICY IF EXISTS "Allow service role full access on app_settings" ON app_settings;

CREATE POLICY "Allow public read on cached_google_trends" ON cached_google_trends FOR SELECT USING (true);
CREATE POLICY "Allow public read on cached_youtube_videos" ON cached_youtube_videos FOR SELECT USING (true);
CREATE POLICY "Allow public read on cache_metadata" ON cache_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public read on custom_trends" ON custom_trends FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on featured_videos" ON featured_videos FOR SELECT USING (true);

CREATE POLICY "Allow service role write on cached_google_trends" ON cached_google_trends FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on cached_youtube_videos" ON cached_youtube_videos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on cache_metadata" ON cache_metadata FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on custom_trends" ON custom_trends FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on featured_videos" ON featured_videos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on system_logs" ON system_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on app_settings" ON app_settings FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DONE! Now create admin user in Authentication > Users
-- Email: admin@trendly.app
-- Password: trendlyboys@2025$
-- ============================================
