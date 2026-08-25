-- ============================================================
-- SQL Snippet: Clear All Existing Evaluations
-- Run this in Supabase SQL Editor
-- ============================================================

-- Delete all evaluation records from the database
DELETE FROM public.evaluations;

-- (Optional) If you also want to reset the auto-increment ID counter for evaluations, you can use:
-- TRUNCATE TABLE public.evaluations RESTART IDENTITY CASCADE;
