-- ============================================
-- ACTIVITY TRACKING TABLES
-- Run this in Supabase SQL Editor AFTER the complete_database_setup.sql
-- ============================================

-- Table: User Activity (tracks all user actions)
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    action TEXT NOT NULL,
    details JSONB,
    page TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);

-- Table: Search Logs (tracks all searches)
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    search_type TEXT DEFAULT 'trends',
    industry TEXT,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);

-- Table: API Usage Logs (tracks API calls)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_type TEXT NOT NULL,
    endpoint TEXT,
    units_used INTEGER DEFAULT 1,
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_type ON api_usage_logs(api_type);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow service role full access on user_activity" ON user_activity;
DROP POLICY IF EXISTS "Allow service role full access on search_logs" ON search_logs;
DROP POLICY IF EXISTS "Allow service role full access on api_usage_logs" ON api_usage_logs;

CREATE POLICY "Allow service role full access on user_activity" ON user_activity
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on search_logs" ON search_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on api_usage_logs" ON api_usage_logs
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DONE! Run this SQL in Supabase
-- ============================================
