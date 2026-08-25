-- ============================================================
-- 1. PROJECT EXPO REGISTRATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS project_expo_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leader_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    leader_name TEXT NOT NULL,
    leader_roll TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    project_title TEXT NOT NULL,
    domain TEXT NOT NULL,
    output_type TEXT NOT NULL,
    team_size INTEGER CHECK (team_size IN (2, 3)) NOT NULL,
    member_2_name TEXT NOT NULL,
    member_2_roll TEXT NOT NULL,
    member_3_name TEXT,
    member_3_roll TEXT,
    faculty_mentor_name TEXT NOT NULL,
    faculty_mentor_email TEXT NOT NULL,
    requires_safety_clearance BOOLEAN DEFAULT FALSE,
    safety_details TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE project_expo_registrations ENABLE ROW LEVEL SECURITY;

-- Only the authenticated leader can insert their own registration
DROP POLICY IF EXISTS "Public insert for expo registrations" ON project_expo_registrations;
CREATE POLICY "Public insert for expo registrations" 
ON project_expo_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = leader_id);

-- Students can read their own registrations (if they are logged in)
DROP POLICY IF EXISTS "Students can read own expo registrations" ON project_expo_registrations;
CREATE POLICY "Students can read own expo registrations" 
ON project_expo_registrations 
FOR SELECT 
USING (leader_id = auth.uid());

-- Admins and SPOCs can read all registrations
DROP POLICY IF EXISTS "Admins and SPOCs can view all expo registrations" ON project_expo_registrations;
CREATE POLICY "Admins and SPOCs can view all expo registrations" 
ON project_expo_registrations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'spoc')
  )
);
