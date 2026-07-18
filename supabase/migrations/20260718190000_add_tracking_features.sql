alter table public.workout_entries
  add column if not exists exercise_id text,
  add column if not exists set_type text not null default 'work',
  add column if not exists deleted_at timestamptz;

update public.workout_entries
set exercise_id = lower(trim(both '-' from regexp_replace(exercise, '[^a-zA-Z0-9]+', '-', 'g')))
where exercise_id is null
  and exercise <> '__WORKOUT_COMPLETE__'
  and not is_rest_day;

alter table public.workout_entries
  drop constraint if exists workout_entries_set_type_check,
  add constraint workout_entries_set_type_check check (set_type in ('warmup', 'work')),
  drop constraint if exists workout_entries_load_kg_check,
  add constraint workout_entries_load_kg_check check (load_kg is null or load_kg >= 0),
  drop constraint if exists workout_entries_set_1_reps_check,
  add constraint workout_entries_set_1_reps_check check (set_1_reps is null or set_1_reps between 1 and 50),
  drop constraint if exists workout_entries_set_2_reps_check,
  add constraint workout_entries_set_2_reps_check check (set_2_reps is null or set_2_reps between 1 and 50),
  drop constraint if exists workout_entries_rir_check,
  add constraint workout_entries_rir_check check (rir is null or rir between 0 and 5);

create index if not exists workout_entries_owner_active_created_idx
  on public.workout_entries (user_id, profile_key, created_at desc)
  where deleted_at is null;

create index if not exists workout_entries_owner_exercise_created_idx
  on public.workout_entries (user_id, profile_key, exercise_id, created_at desc)
  where deleted_at is null and set_type = 'work';

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_key text not null,
  entry_date date not null default current_date,
  body_weight_kg numeric,
  sleep_hours numeric,
  readiness smallint,
  pain_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_checkins_owner_date_key unique (user_id, profile_key, entry_date),
  constraint daily_checkins_body_weight_check check (body_weight_kg is null or body_weight_kg between 20 and 400),
  constraint daily_checkins_sleep_check check (sleep_hours is null or sleep_hours between 0 and 24),
  constraint daily_checkins_readiness_check check (readiness is null or readiness between 1 and 5),
  constraint daily_checkins_pain_notes_check check (char_length(pain_notes) <= 1000)
);

create index if not exists daily_checkins_owner_date_idx
  on public.daily_checkins (user_id, profile_key, entry_date desc);

alter table public.daily_checkins enable row level security;

grant select, insert, update, delete on public.daily_checkins to authenticated;

drop policy if exists "Users can view own daily checkins" on public.daily_checkins;
create policy "Users can view own daily checkins"
  on public.daily_checkins for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own daily checkins" on public.daily_checkins;
create policy "Users can insert own daily checkins"
  on public.daily_checkins for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own daily checkins" on public.daily_checkins;
create policy "Users can update own daily checkins"
  on public.daily_checkins for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own daily checkins" on public.daily_checkins;
create policy "Users can delete own daily checkins"
  on public.daily_checkins for delete to authenticated
  using ((select auth.uid()) = user_id);
