-- =============================================
-- Saved Scripts Table for Content Creation Workflow
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing table if needed (for fresh start)
DROP TABLE IF EXISTS saved_scripts;

-- Create saved_scripts table
CREATE TABLE saved_scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'youtube_shorts', 'tiktok', 'blog', 'twitter', 'linkedin')),
    idea_text TEXT,
    script_content JSONB NOT NULL DEFAULT '{}',
    source_video_id TEXT,
    source_video_title TEXT,
    source_video_thumbnail TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX idx_saved_scripts_user_id ON saved_scripts(user_id);
CREATE INDEX idx_saved_scripts_platform ON saved_scripts(platform);
CREATE INDEX idx_saved_scripts_created_at ON saved_scripts(created_at DESC);

-- Enable RLS
ALTER TABLE saved_scripts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own scripts
CREATE POLICY "Users can view own scripts" ON saved_scripts
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own scripts
CREATE POLICY "Users can insert own scripts" ON saved_scripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own scripts
CREATE POLICY "Users can update own scripts" ON saved_scripts
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own scripts
CREATE POLICY "Users can delete own scripts" ON saved_scripts
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Service role has full access
CREATE POLICY "Service role full access" ON saved_scripts
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- DONE! Run this SQL in Supabase
-- =============================================
