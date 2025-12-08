-- ============================================
-- TRENDLY CACHE TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Table 1: Cached Google Trends
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

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_cached_google_trends_industry ON cached_google_trends(industry);
CREATE INDEX IF NOT EXISTS idx_cached_google_trends_expires ON cached_google_trends(expires_at);

-- Table 2: Cached YouTube Videos
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

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_industry ON cached_youtube_videos(industry);
CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_expires ON cached_youtube_videos(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_youtube_videos_views ON cached_youtube_videos(view_count DESC);

-- Table 3: Cache metadata (to track when cache was last refreshed)
CREATE TABLE IF NOT EXISTS cache_metadata (
    id TEXT PRIMARY KEY DEFAULT 'main',
    last_google_refresh TIMESTAMPTZ,
    last_youtube_refresh TIMESTAMPTZ,
    google_trends_count INTEGER DEFAULT 0,
    youtube_videos_count INTEGER DEFAULT 0,
    refresh_status TEXT DEFAULT 'idle',
    last_error TEXT
);

-- Insert initial metadata row
INSERT INTO cache_metadata (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security) - but allow public read
ALTER TABLE cached_google_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached data
CREATE POLICY "Allow public read on cached_google_trends" ON cached_google_trends
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on cached_youtube_videos" ON cached_youtube_videos
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on cache_metadata" ON cache_metadata
    FOR SELECT USING (true);

-- Allow service role full access (for admin refresh)
CREATE POLICY "Allow service role write on cached_google_trends" ON cached_google_trends
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on cached_youtube_videos" ON cached_youtube_videos
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on cache_metadata" ON cache_metadata
    FOR ALL USING (auth.role() = 'service_role');

-- Done! 
-- ============================================
