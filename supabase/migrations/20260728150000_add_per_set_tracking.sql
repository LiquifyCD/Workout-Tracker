alter table public.profile_settings
  add column if not exists strength_sex text,
  add column if not exists body_weight_kg numeric;

alter table public.profile_settings
  drop constraint if exists profile_settings_strength_sex_check,
  add constraint profile_settings_strength_sex_check
    check (strength_sex is null or strength_sex in ('male', 'female')),
  drop constraint if exists profile_settings_body_weight_check,
  add constraint profile_settings_body_weight_check
    check (body_weight_kg is null or body_weight_kg between 20 and 400);

alter table public.workout_entries
  add column if not exists workout_session_id uuid,
  add column if not exists set_number smallint,
  add column if not exists scheduled_sets_snapshot smallint,
  add column if not exists set_status text not null default 'logged';

alter table public.workout_entries
  drop constraint if exists workout_entries_set_number_check,
  add constraint workout_entries_set_number_check
    check (set_number is null or set_number between 1 and 50),
  drop constraint if exists workout_entries_scheduled_sets_check,
  add constraint workout_entries_scheduled_sets_check
    check (scheduled_sets_snapshot is null or scheduled_sets_snapshot between 1 and 50),
  drop constraint if exists workout_entries_set_status_check,
  add constraint workout_entries_set_status_check
    check (set_status in ('logged', 'skipped')),
  drop constraint if exists workout_entries_skipped_values_check,
  add constraint workout_entries_skipped_values_check
    check (
      set_status = 'logged'
      or (load_kg is null and set_1_reps is null and set_2_reps is null and rir is null)
    );

create index if not exists workout_entries_owner_session_idx
  on public.workout_entries (user_id, profile_key, workout_session_id, created_at)
  where deleted_at is null and workout_session_id is not null;

comment on column public.profile_settings.body_weight_kg is
  'Optional profile-level body weight for relative strength standards. Historical daily check-in weights remain untouched.';

comment on column public.workout_entries.scheduled_sets_snapshot is
  'Scheduled set count captured when the set was logged so later programme edits do not rewrite history.';
