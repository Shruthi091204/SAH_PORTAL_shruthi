-- ============================================================
-- SQL Snippet: Add 5 Judge Accounts (Safe/Upsert Mode)
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor)
-- ============================================================

DO $$
DECLARE
    v_password TEXT := 'JudgeSAH2026!';
    v_users JSONB := '[
        {"email": "judge1@amrita.edu", "name": "Dr. Judge One", "dept": "CSE"},
        {"email": "judge2@amrita.edu", "name": "Dr. Judge Two", "dept": "ECE"},
        {"email": "judge3@amrita.edu", "name": "Dr. Judge Three", "dept": "MECH"},
        {"email": "judge4@amrita.edu", "name": "Dr. Judge Four", "dept": "AIE"},
        {"email": "judge5@amrita.edu", "name": "Dr. Judge Five", "dept": "CYS"}
    ]';
    v_user JSONB;
    v_user_id UUID;
    v_exists BOOLEAN;
BEGIN
    FOR v_user IN SELECT * FROM jsonb_array_elements(v_users)
    LOOP
        -- Check if user already exists
        SELECT EXISTS (
            SELECT 1 FROM auth.users WHERE email = v_user->>'email'
        ) INTO v_exists;

        IF NOT v_exists THEN
            v_user_id := gen_random_uuid();
            
            -- Insert into auth.users
            INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
            VALUES (
                v_user_id,
                '00000000-0000-0000-0000-000000000000',
                v_user->>'email',
                crypt(v_password, gen_salt('bf')),
                NOW(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('full_name', v_user->>'name', 'role', 'judge'),
                NOW(), NOW(), 'authenticated', 'authenticated'
            );

            -- Insert into auth.identities
            INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
            VALUES (
                v_user_id,
                v_user_id,
                jsonb_build_object('sub', v_user_id, 'email', v_user->>'email'),
                'email',
                v_user->>'email',
                NOW(), NOW(), NOW()
            );

            -- Insert or Update public.profiles (Handles auto-triggers if any)
            INSERT INTO profiles (id, full_name, email, college_email, gender, department, role, phone, year_of_study)
            VALUES (
                v_user_id,
                v_user->>'name',
                v_user->>'email',
                v_user->>'email',
                'Male',
                v_user->>'dept',
                'judge',
                '+91 0000000000',
                'Faculty / Staff'
            )
            ON CONFLICT (id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                gender = EXCLUDED.gender,
                department = EXCLUDED.department,
                role = EXCLUDED.role,
                phone = EXCLUDED.phone,
                year_of_study = EXCLUDED.year_of_study;
        END IF;
    END LOOP;
END $$;
