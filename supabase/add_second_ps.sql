ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS ps_id_2 UUID REFERENCES public.problem_statements(id);
