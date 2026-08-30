-- ============================================================
-- SQL Snippet: Allow Team Leaders to DELETE Join Requests
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add DELETE policy for join_requests so leaders can completely remove kicked users
CREATE POLICY "Leader delete requests" ON public.join_requests
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())
  );
