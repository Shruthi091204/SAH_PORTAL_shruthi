-- ============================================================
-- SAH 2026 OTP & ATO SECURITY PATCH
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. LOCK DOWN OTP TABLES
-- Prevent anyone from reading OTPs from the database
DROP POLICY IF EXISTS "Read Registration OTP Policy" ON registration_otps;
DROP POLICY IF EXISTS "Delete Registration OTP Policy" ON registration_otps;
-- For password_resets, let's just make sure there are no public policies
DROP POLICY IF EXISTS "Public Read password_resets" ON password_resets;
DROP POLICY IF EXISTS "Read Password Resets" ON password_resets;
DROP POLICY IF EXISTS "Delete Password Resets" ON password_resets;
-- (Assuming password_resets has some policies, we drop common names. Best is to explicitly disable SELECT for anon)

-- 2. DROP THE VULNERABLE PASSWORD RESET FUNCTION
-- This function allowed anyone to bypass OTPs
DROP FUNCTION IF EXISTS reset_user_password_by_email(TEXT, TEXT);

-- 3. CREATE SECURE PASSWORD RESET FUNCTION
-- This securely verifies the OTP *inside* the transaction before resetting the password
CREATE OR REPLACE FUNCTION verify_otp_and_reset_password(p_email TEXT, p_otp TEXT, p_new_password TEXT)
RETURNS JSONB AS $$
DECLARE
    v_otp_record RECORD;
    v_true_email TEXT;
BEGIN
    -- Resolve the true email by checking profiles (matches edge function logic)
    SELECT email INTO v_true_email
    FROM profiles
    WHERE email = p_email OR college_email = p_email
    LIMIT 1;

    -- Fallback to the provided email if not found in profiles (just in case)
    IF v_true_email IS NULL THEN
        v_true_email := p_email;
    END IF;

    -- 1. Check if OTP exists and is valid
    SELECT * INTO v_otp_record
    FROM password_resets
    WHERE email = v_true_email 
      AND otp_code = p_otp 
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_otp_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired OTP code.');
    END IF;

    -- 2. Update the user's password securely using Supabase auth
    UPDATE auth.users 
    SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
    WHERE email = v_true_email;

    -- 3. Delete the used OTP to prevent reuse
    DELETE FROM password_resets 
    WHERE email = v_true_email AND otp_code = p_otp;

    RETURN jsonb_build_object('success', true, 'message', 'Password successfully reset.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. FIX REGISTRATION OTP FUNCTION (if vulnerable)
-- Ensure this function deletes the OTP after successful verification
CREATE OR REPLACE FUNCTION verify_registration_otp(p_email TEXT, p_otp TEXT)
RETURNS JSONB AS $$
DECLARE
    v_otp_record RECORD;
    v_form_data JSONB;
BEGIN
    -- Find a valid, unexpired OTP
    SELECT form_data INTO v_form_data
    FROM registration_otps
    WHERE college_email = p_email 
      AND otp_code = p_otp
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_form_data IS NULL THEN
        -- Return an error if no valid OTP is found. 
        -- Note: We throw an exception so PostgREST returns a 400 error.
        RAISE EXCEPTION 'Invalid or expired OTP code.';
    END IF;

    -- Delete all OTPs for this email to prevent reuse
    DELETE FROM registration_otps WHERE college_email = p_email;

    -- Return the form data so the frontend can proceed with account creation
    RETURN v_form_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RESOLVE AUTH EMAIL FUNCTION
-- Allows unauthenticated users to securely resolve a college email to the primary auth email for login
CREATE OR REPLACE FUNCTION resolve_auth_email(p_input TEXT)
RETURNS TEXT AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email
    FROM profiles
    WHERE email = p_input OR college_email = p_input
    LIMIT 1;
    
    RETURN COALESCE(v_email, p_input);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
