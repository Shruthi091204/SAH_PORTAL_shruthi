-- ============================================================
-- FINAL SECURITY LOCKDOWN MIGRATION
-- Consolidates all manual security patches into a permanent migration.
-- ============================================================

BEGIN;

-- 1. SECURE PASSWORD RESETS (RLS & Deny-All)
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read password_resets" ON password_resets;
DROP POLICY IF EXISTS "Read Password Resets" ON password_resets;
DROP POLICY IF EXISTS "Delete Password Resets" ON password_resets;

-- 2. SECURE REGISTRATION OTPS
ALTER TABLE registration_otps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read Registration OTP Policy" ON registration_otps;
DROP POLICY IF EXISTS "Delete Registration OTP Policy" ON registration_otps;

-- 3. FIX VULNERABLE RPC: DROP OLD & CREATE SECURE OTP VERIFICATION
DROP FUNCTION IF EXISTS reset_user_password_by_email(TEXT, TEXT);

CREATE OR REPLACE FUNCTION verify_otp_and_reset_password(p_email TEXT, p_otp TEXT, p_new_password TEXT)
RETURNS JSONB AS $$
DECLARE
    v_otp_record RECORD;
BEGIN
    SELECT * INTO v_otp_record
    FROM password_resets
    WHERE email = p_email 
      AND otp_code = p_otp 
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_otp_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired OTP code.');
    END IF;

    UPDATE auth.users 
    SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
    WHERE email = p_email;

    DELETE FROM password_resets 
    WHERE email = p_email AND otp_code = p_otp;

    RETURN jsonb_build_object('success', true, 'message', 'Password successfully reset.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FIX PRIVILEGE ESCALATION ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_roll_no TEXT;
  v_skills TEXT[];
BEGIN
  v_role := 'student';
  v_roll_no := NULLIF(TRIM(new.raw_user_meta_data->>'roll_no'), '');
  
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
    new.id, v_roll_no, COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email, COALESCE(new.raw_user_meta_data->>'gender', 'Male'),
    COALESCE(new.raw_user_meta_data->>'department', 'CSE'), v_role,
    COALESCE(v_skills, '{}'::TEXT[]), NULLIF(TRIM(new.raw_user_meta_data->>'phone'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'year_of_study'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'github_url'), ''), NULLIF(TRIM(new.raw_user_meta_data->>'linkedin_url'), '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name, roll_no = COALESCE(EXCLUDED.roll_no, profiles.roll_no),
    department = EXCLUDED.department, gender = EXCLUDED.gender,
    skills = COALESCE(EXCLUDED.skills, profiles.skills), phone = COALESCE(EXCLUDED.phone, profiles.phone),
    year_of_study = COALESCE(EXCLUDED.year_of_study, profiles.year_of_study),
    github_url = COALESCE(EXCLUDED.github_url, profiles.github_url),
    linkedin_url = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. STRICT READ PROFILES
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
DROP POLICY IF EXISTS "Strict Read Profiles" ON profiles;
CREATE POLICY "Strict Read Profiles" ON profiles 
FOR SELECT USING (
  auth.uid() = id OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'judge', 'spoc') OR
  role = 'student'
);

-- 6. STRICT READ TEAMS
DROP POLICY IF EXISTS "Public Read Teams" ON teams;
CREATE POLICY "Authenticated Read Teams" ON teams 
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 7. SECURE TEAM INVITATIONS
DROP POLICY IF EXISTS "Read invitations" ON team_invitations;
CREATE POLICY "Secure Read Invitations" ON team_invitations 
FOR SELECT USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM teams WHERE teams.id = team_id AND teams.leader_id = auth.uid())
);

-- 8. TEAM LEADER PROTECTED UPDATES TRIGGER
CREATE OR REPLACE FUNCTION prevent_unauthorized_team_updates()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;

  SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();

  IF v_caller_role NOT IN ('admin', 'spoc') THEN
    IF auth.uid() != OLD.leader_id THEN
      IF NEW.is_locked IS DISTINCT FROM OLD.is_locked THEN
        RAISE EXCEPTION 'Only the Team Leader or Admins/SPOCs can modify the locked status of a team.';
      END IF;
      IF NEW.is_spoc_verified IS DISTINCT FROM OLD.is_spoc_verified THEN
        RAISE EXCEPTION 'Only Admins/SPOCs can modify the verified status of a team.';
      END IF;
    ELSE
      IF NEW.is_spoc_verified IS DISTINCT FROM OLD.is_spoc_verified THEN
        IF NEW.is_spoc_verified = TRUE THEN
           RAISE EXCEPTION 'Team Leaders cannot verify their own team. Only Admins/SPOCs can verify.';
        END IF;
      END IF;
    END IF;

    IF OLD.is_locked = TRUE THEN
        IF NEW.ps_id IS DISTINCT FROM OLD.ps_id OR NEW.ps_id_2 IS DISTINCT FROM OLD.ps_id_2 THEN
          RAISE EXCEPTION 'Cannot modify problem statements of a locked team. Please unlock the team first.';
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

COMMIT;
