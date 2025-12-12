-- Instagram Reels Cache Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS instagram_reels_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reel_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_pic TEXT,
    caption TEXT,
    thumbnail TEXT,
    video_url TEXT,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    plays_count BIGINT DEFAULT 0,
    shares_count BIGINT DEFAULT 0,
    audio_name TEXT,
    audio_artist TEXT,
    hashtags TEXT[],
    mentions TEXT[],
    duration_seconds INTEGER,
    posted_at TIMESTAMPTZ,
    niche TEXT DEFAULT 'GENERAL',
    is_active BOOLEAN DEFAULT true,
    viral_score INTEGER DEFAULT 50,
    display_order BIGINT DEFAULT 0,
    cached_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_reels_niche ON instagram_reels_cache(niche);
CREATE INDEX IF NOT EXISTS idx_reels_viral_score ON instagram_reels_cache(viral_score DESC);
CREATE INDEX IF NOT EXISTS idx_reels_plays ON instagram_reels_cache(plays_count DESC);
CREATE INDEX IF NOT EXISTS idx_reels_active ON instagram_reels_cache(is_active);
CREATE INDEX IF NOT EXISTS idx_reels_cached_at ON instagram_reels_cache(cached_at DESC);

-- Enable RLS
ALTER TABLE instagram_reels_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for reels" ON instagram_reels_cache
    FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access for reels" ON instagram_reels_cache
    FOR ALL USING (auth.role() = 'service_role');
