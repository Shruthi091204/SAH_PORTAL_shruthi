-- SAH production security remediation. This migration preserves application records.
-- It intentionally redacts only leaked plaintext credentials and invalidates old OTPs.
-- Run in Supabase SQL Editor, then deploy the auth-otp Edge Function before deploying the UI.

begin;

create extension if not exists pgcrypto;

-- Credentials are not business data. Redact any historical copies without deleting registrations.
update public.registration_otps
set form_data = coalesce(form_data, '{}'::jsonb) - 'password' - 'confirmPassword';

-- Retire public account-takeover entry points, regardless of which legacy signature exists.
do $$
declare f record;
begin
  for f in select oid::regprocedure as signature from pg_proc
           where pronamespace = 'public'::regnamespace
             and proname in ('reset_user_password_by_email', 'secure_reset_password', 'verify_registration_otp')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.signature);
  end loop;
end $$;

-- Challenges are server-only. A SHA-256 OTP digest is sufficient for a short-lived random OTP.
create table if not exists public.auth_otp_challenges (
  id uuid primary key default gen_random_uuid(),
  purpose text not null check (purpose in ('registration', 'password_reset')),
  email text not null,
  otp_hash text not null,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists auth_otp_challenges_active_idx
  on public.auth_otp_challenges (purpose, email, expires_at desc) where consumed_at is null;
alter table public.auth_otp_challenges enable row level security;
revoke all on public.auth_otp_challenges from public, anon, authenticated;

alter table public.registration_otps enable row level security;
alter table public.password_resets enable row level security;
revoke all on public.registration_otps, public.password_resets from public, anon, authenticated;

-- Restrict profiles and expose a deliberately small authenticated directory for team formation.
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;
revoke all on function public.my_role() from public;
grant execute on function public.my_role() to authenticated;

alter table public.profiles enable row level security;
drop policy if exists "Public Read Profiles" on public.profiles;
drop policy if exists "Strict Read Profiles" on public.profiles;
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
create policy "profiles: self or privileged read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.my_role() in ('admin', 'judge', 'spoc'));
create policy "profiles: self update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
revoke update (role) on public.profiles from authenticated, anon;

drop view if exists public.directory;
create view public.directory with (security_invoker = false) as
  select id, full_name, roll_no, gender, department, skills, year_of_study, campus
  from public.profiles where role = 'student';
revoke all on public.directory from public, anon;
grant select on public.directory to authenticated;

-- Notifications are recipient-read-only. Server-side triggers/Edge Functions use service_role.
alter table public.notifications enable row level security;
drop policy if exists "System insert notifications" on public.notifications;
drop policy if exists "Read own notifications" on public.notifications;
drop policy if exists "Update own notifications" on public.notifications;
create policy "notifications: recipient reads" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications: recipient marks read" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on public.notifications from anon;
revoke insert, delete on public.notifications from authenticated;

-- Evaluation and panel data must never be public.
alter table public.evaluations enable row level security;
drop policy if exists "Read evaluations" on public.evaluations;
drop policy if exists "Judges insert evaluations" on public.evaluations;
drop policy if exists "Judges update own evaluations" on public.evaluations;
create policy "evaluations: authorized read" on public.evaluations for select to authenticated
  using (judge_id = auth.uid() or public.my_role() in ('admin', 'spoc'));
create policy "evaluations: judge insert" on public.evaluations for insert to authenticated
  with check (judge_id = auth.uid() and public.my_role() = 'judge');
create policy "evaluations: author update" on public.evaluations for update to authenticated
  using (judge_id = auth.uid()) with check (judge_id = auth.uid());

alter table public.judge_panels enable row level security;
alter table public.panel_judges enable row level security;
alter table public.panel_problem_statements enable row level security;
drop policy if exists "Read judge_panels" on public.judge_panels;
drop policy if exists "Read panel_judges" on public.panel_judges;
drop policy if exists "Read panel_problem_statements" on public.panel_problem_statements;
create policy "judge_panels: assigned or privileged read" on public.judge_panels for select to authenticated
  using (public.my_role() in ('admin','spoc') or exists (select 1 from public.panel_judges pj where pj.panel_id = id and pj.judge_id = auth.uid()));
create policy "panel_judges: self or privileged read" on public.panel_judges for select to authenticated
  using (judge_id = auth.uid() or public.my_role() in ('admin','spoc'));
create policy "panel_problem_statements: assigned judge or privileged read" on public.panel_problem_statements for select to authenticated
  using (public.my_role() in ('admin','spoc') or exists (select 1 from public.panel_judges pj where pj.panel_id = panel_id and pj.judge_id = auth.uid()));

-- No client should invoke privileged security-definer functions unless explicitly granted above.
revoke execute on function public.lock_and_verify_sih_team(uuid) from public, anon;
grant execute on function public.lock_and_verify_sih_team(uuid) to authenticated;

commit;
