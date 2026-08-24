-- Run this in your Supabase SQL Editor to add Mentor fields to the teams table

ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS mentor_name TEXT,
ADD COLUMN IF NOT EXISTS mentor_department TEXT;
