-- ============================================================
-- SQL Snippet: Fix Judge Login (Auth Schema Error)
-- Run this in Supabase SQL Editor
-- ============================================================

-- When manually inserting users (like we did with the judges), Supabase Auth 
-- requires certain token columns to be empty strings ('') rather than NULL.
-- This script fixes the NULL values so the login will succeed.

UPDATE auth.users 
SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change = COALESCE(email_change, '');
