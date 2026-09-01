-- ============================================================
-- SAH 2026 ADMIN SECURITY HARDENING SCRIPT
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. FIX PRIVILEGE ESCALATION ON SIGNUP
-- We must aggressively force the role to be 'student' for all new signups 
-- to prevent an attacker from passing `{"role": "admin"}` in their metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_roll_no TEXT;
  v_skills TEXT[];
BEGIN
  -- VULNERABILITY FIX: Ignore the client-provided role entirely.
  -- Only 'student' can sign up via the frontend. 
  -- Admins/Judges/SPOCs must be created manually or promoted via backend.
  v_role := 'student';
  
  v_roll_no := NULLIF(TRIM(new.raw_user_meta_data->>'roll_no'), '');
  
  -- Safely parse skills array from JSON metadata
  BEGIN
    IF new.raw_user_meta_data->'skills' IS NOT NULL AND jsonb_typeof(new.raw_user_meta_data->'skills') = 'array' THEN
      SELECT ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'skills')) INTO v_skills;
    ELSE
      v_skills := '{}'::TEXT[];
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_skills := '{}'::TEXT[];
  END;

  INSERT INTO public.profiles (
    id, roll_no, full_name, email, gender, department, role,
    skills, phone, year_of_study, github_url, linkedin_url
  )
  VALUES (
    new.id,
    v_roll_no,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'gender', 'Male'),
    COALESCE(new.raw_user_meta_data->>'department', 'CSE'),
    v_role,
    COALESCE(v_skills, '{}'::TEXT[]),
    NULLIF(TRIM(new.raw_user_meta_data->>'phone'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'year_of_study'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'github_url'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'linkedin_url'), '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    roll_no = COALESCE(EXCLUDED.roll_no, profiles.roll_no),
    department = EXCLUDED.department,
    gender = EXCLUDED.gender,
    skills = COALESCE(EXCLUDED.skills, profiles.skills),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    year_of_study = COALESCE(EXCLUDED.year_of_study, profiles.year_of_study),
    github_url = COALESCE(EXCLUDED.github_url, profiles.github_url),
    linkedin_url = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url);
    -- Intentionally omitting `role = EXCLUDED.role` so signup cannot downgrade/upgrade existing roles.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. RESTRICT DATA LEAKAGE ON PROFILES
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;

-- Allow reading a profile if:
-- 1. It is the user's own profile.
-- 2. The caller is an admin, judge, or spoc.
-- 3. The requested profile belongs to a 'student' (needed for team building/invites).
CREATE POLICY "Strict Read Profiles" ON profiles 
FOR SELECT USING (
  auth.uid() = id OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'judge', 'spoc') OR
  role = 'student'
);


-- 3. SECURE TEAMS TABLE UPDATES
-- We create a trigger to block leaders from updating protected columns.
CREATE OR REPLACE FUNCTION prevent_unauthorized_team_updates()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- If it's a backend operation (service role), allow it.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the caller's role
  SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();

  -- If caller is not admin/spoc, ensure they cannot change protected fields
  IF v_caller_role NOT IN ('admin', 'spoc') THEN
    IF NEW.is_locked IS DISTINCT FROM OLD.is_locked THEN
      RAISE EXCEPTION 'Only Admins/SPOCs can modify the locked status of a team.';
    END IF;
    IF NEW.is_spoc_verified IS DISTINCT FROM OLD.is_spoc_verified THEN
      RAISE EXCEPTION 'Only Admins/SPOCs can modify the verified status of a team.';
    END IF;
    -- If a team is locked, the leader cannot change the PS ID anymore
    IF OLD.is_locked = TRUE THEN
        IF NEW.ps_id IS DISTINCT FROM OLD.ps_id OR NEW.ps_id_2 IS DISTINCT FROM OLD.ps_id_2 THEN
          RAISE EXCEPTION 'Cannot modify problem statements of a locked team.';
        END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS block_protected_team_updates ON teams;
CREATE TRIGGER block_protected_team_updates
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION prevent_unauthorized_team_updates();


-- 4. SECURE THE LOCK & VERIFY RPC
CREATE OR REPLACE FUNCTION lock_and_verify_sih_team(p_team_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_member_count INT;
    v_female_count INT;
    v_conflicting_student TEXT;
    v_has_ps BOOLEAN;
    v_leader_id UUID;
    v_caller_role TEXT;
BEGIN
    -- Authorization Check: Caller must be the team leader OR an admin/spoc
    SELECT leader_id INTO v_leader_id FROM teams WHERE id = p_team_id;
    SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();
    
    IF auth.uid() != v_leader_id AND v_caller_role NOT IN ('admin', 'spoc') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Only the team leader or an admin can lock this team.');
    END IF;

    -- Check 1: Exactly 6 Members
    SELECT COUNT(*) INTO v_member_count 
    FROM team_members 
    WHERE team_id = p_team_id;
    
    IF v_member_count != 6 THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', format('SIH Guardrail Error: Team must have exactly 6 members. Current count: %s', v_member_count)
        );
    END IF;
    
    -- Check 2: At least 1 Female Member
    SELECT COUNT(*) INTO v_female_count 
    FROM team_members tm
    JOIN profiles p ON tm.student_id = p.id
    WHERE tm.team_id = p_team_id AND p.gender = 'Female';
    
    IF v_female_count < 1 THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'SIH Guardrail Error: Team must have at least 1 female member.'
        );
    END IF;
    
    -- Check 3: Problem Statement assigned
    SELECT (ps_id IS NOT NULL) INTO v_has_ps
    FROM teams WHERE id = p_team_id;
    
    IF NOT v_has_ps THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'SIH Guardrail Error: Team must have a problem statement assigned.'
        );
    END IF;
    
    -- Check 4: Single-Team Constraint (No student in another locked team)
    SELECT p.full_name INTO v_conflicting_student
    FROM team_members tm
    JOIN profiles p ON tm.student_id = p.id
    JOIN team_members tm_other ON tm_other.student_id = p.id
    JOIN teams t_other ON tm_other.team_id = t_other.id
    WHERE tm.team_id = p_team_id 
      AND t_other.id != p_team_id 
      AND t_other.is_locked = TRUE
    LIMIT 1;
    
    IF v_conflicting_student IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', format('SIH Guardrail Error: Member "%s" is already in another locked team.', v_conflicting_student)
        );
    END IF;
    
    -- All checks passed — Lock the Team
    UPDATE teams SET is_locked = TRUE, is_open_for_recruitment = FALSE WHERE id = p_team_id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'SIH Verification Passed! Team is now locked and ready for SPOC review.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. SERVER-SIDE ROUTE AUTHORIZATION CHECKS (RPC)
-- This function allows the frontend to securely verify a user's role 
-- without trusting client-side local storage.
CREATE OR REPLACE FUNCTION check_user_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  
  IF v_role = ANY(required_roles) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
