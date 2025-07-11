-- =====================================================
-- PIZZA MASTER TYCOON - SUPABASE DATABASE SETUP
-- =====================================================

-- 1. Create players table
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    email TEXT,
    saldo INTEGER DEFAULT 100 CHECK (saldo >= 0),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    nivel INTEGER DEFAULT 1 CHECK (nivel >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_nivel ON players(nivel);

-- 3. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for RLS
-- Users can only see and modify their own data
CREATE POLICY "Users can view own player data" ON players
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own player data" ON players
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own player data" ON players
    FOR UPDATE USING (auth.uid()::text = user_id);

-- 7. Create view for leaderboard (optional)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    username,
    nivel,
    saldo,
    xp,
    created_at
FROM players
ORDER BY nivel DESC, saldo DESC, xp DESC
LIMIT 100;

-- 8. Grant permissions (if needed)
-- GRANT ALL ON players TO authenticated;
-- GRANT SELECT ON leaderboard TO authenticated;

-- 9. Insert sample data (optional - remove in production)
-- INSERT INTO players (user_id, username, email, saldo, xp, nivel) 
-- VALUES 
--     ('sample-user-1', 'Chef Demo', 'demo@pizza.com', 500, 150, 2),
--     ('sample-user-2', 'Pizza Master', 'master@pizza.com', 1000, 300, 3);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if table was created successfully
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'players'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'players';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'players';

-- =====================================================
-- USEFUL QUERIES FOR ADMINISTRATION
-- =====================================================

-- Count total players
-- SELECT COUNT(*) as total_players FROM players;

-- Get top players by level
-- SELECT username, nivel, saldo, xp FROM players ORDER BY nivel DESC, saldo DESC LIMIT 10;

-- Get players who joined today
-- SELECT username, created_at FROM players WHERE DATE(created_at) = CURRENT_DATE;

-- Reset a player's stats (example)
-- UPDATE players SET saldo = 100, xp = 0, nivel = 1 WHERE user_id = 'user-id-here';