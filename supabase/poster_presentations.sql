-- ============================================================
-- 1. POSTER PRESENTATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS poster_presentations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_roll TEXT NOT NULL,
    author_email TEXT NOT NULL,
    poster_title TEXT NOT NULL,
    track TEXT NOT NULL,
    faculty_mentor_name TEXT NOT NULL,
    faculty_mentor_email TEXT NOT NULL,
    agree_integrity BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE poster_presentations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own registration, and guests to insert with NULL author_id
DROP POLICY IF EXISTS "Public insert for poster presentations" ON poster_presentations;
CREATE POLICY "Public insert for poster presentations" 
ON poster_presentations 
FOR INSERT 
WITH CHECK (
    (auth.uid() IS NULL AND author_id IS NULL) OR 
    (auth.uid() = author_id)
);

-- Students can read their own registrations (if they are logged in)
DROP POLICY IF EXISTS "Students can read own poster presentations" ON poster_presentations;
CREATE POLICY "Students can read own poster presentations" 
ON poster_presentations 
FOR SELECT 
USING (author_id = auth.uid());

-- Admins and SPOCs can read all registrations
DROP POLICY IF EXISTS "Admins and SPOCs can view all poster presentations" ON poster_presentations;
CREATE POLICY "Admins and SPOCs can view all poster presentations" 
ON poster_presentations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'spoc')
  )
);
