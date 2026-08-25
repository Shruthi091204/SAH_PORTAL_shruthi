-- ============================================================
-- SQL Snippet: Fix Marketplace Team Status and Disbands
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add the missing DELETE policy for teams (allows leaders to actually disband teams)
DROP POLICY IF EXISTS "Leader Delete Teams" ON public.teams;
CREATE POLICY "Leader Delete Teams" ON public.teams
  FOR DELETE
  USING (auth.uid() = leader_id);

-- 2. Clean up "ghost" teams (like Team QWE) that were disbanded but RLS blocked their deletion
DELETE FROM public.teams t 
WHERE NOT EXISTS (
  SELECT 1 FROM public.team_members m WHERE m.team_id = t.id
);

-- 3. Fix teams (like Team Supernova) that have < 6 members but are stuck as "Closed"
UPDATE public.teams t
SET is_open_for_recruitment = true
WHERE is_locked = false 
  AND is_open_for_recruitment = false
  AND (SELECT count(*) FROM public.team_members m WHERE m.team_id = t.id) < 6;
