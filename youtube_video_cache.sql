-- YouTube Video Cache Table
-- Stores 1000+ videos per niche for fast loading

-- Drop existing table if you want to recreate
-- DROP TABLE IF EXISTS youtube_video_cache;

CREATE TABLE IF NOT EXISTS youtube_video_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT NOT NULL,
    channel_title TEXT NOT NULL,
    channel_id TEXT,
    published_at TIMESTAMPTZ,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    duration TEXT,
    tags TEXT[], -- Array of tags
    niche TEXT NOT NULL, -- tech, health, gaming, etc.
    country TEXT DEFAULT 'IN',
    
    -- AI Analysis (pre-computed for speed)
    ai_insight TEXT, -- Why it's trending
    content_idea TEXT, -- Content idea for user
    viral_score INTEGER, -- 1-100 viral potential
    
    -- Metadata
    cached_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0 -- For ordering within niche
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_youtube_cache_niche ON youtube_video_cache(niche);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_country ON youtube_video_cache(country);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_niche_country ON youtube_video_cache(niche, country);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_view_count ON youtube_video_cache(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_cached_at ON youtube_video_cache(cached_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_display_order ON youtube_video_cache(niche, display_order);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_active ON youtube_video_cache(is_active) WHERE is_active = true;

-- Function to get paginated videos for a niche
CREATE OR REPLACE FUNCTION get_niche_videos(
    p_niche TEXT,
    p_country TEXT DEFAULT 'IN',
    p_limit INTEGER DEFAULT 30,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    video_id TEXT,
    title TEXT,
    description TEXT,
    thumbnail TEXT,
    channel_title TEXT,
    view_count BIGINT,
    like_count BIGINT,
    published_at TIMESTAMPTZ,
    ai_insight TEXT,
    content_idea TEXT,
    viral_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        yvc.video_id,
        yvc.title,
        yvc.description,
        yvc.thumbnail,
        yvc.channel_title,
        yvc.view_count,
        yvc.like_count,
        yvc.published_at,
        yvc.ai_insight,
        yvc.content_idea,
        yvc.viral_score
    FROM youtube_video_cache yvc
    WHERE yvc.niche = UPPER(p_niche)
      AND yvc.country = p_country
      AND yvc.is_active = true
    ORDER BY yvc.display_order, yvc.view_count DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to count videos per niche
CREATE OR REPLACE FUNCTION count_niche_videos(p_niche TEXT, p_country TEXT DEFAULT 'IN')
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM youtube_video_cache 
        WHERE niche = UPPER(p_niche) 
          AND country = p_country 
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Niche enum for reference
COMMENT ON TABLE youtube_video_cache IS 'Supported niches: TECH, HEALTH, GAMING, ENTERTAINMENT, BUSINESS, FASHION, FOOD, EDUCATION, TRAVEL, FITNESS, FINANCE, BEAUTY, MUSIC, SPORTS';

-- Sample insert (for testing)
-- INSERT INTO youtube_video_cache (video_id, title, thumbnail, channel_title, niche, view_count, ai_insight)
-- VALUES ('test123', 'Sample Video', 'https://img.youtube.com/vi/test123/maxresdefault.jpg', 'Sample Channel', 'TECH', 100000, 'This is trending because...');
