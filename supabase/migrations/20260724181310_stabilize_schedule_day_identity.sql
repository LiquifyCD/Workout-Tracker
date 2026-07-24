alter table public.workout_entries
  add column if not exists schedule_day_id text;

update public.workout_entries
set schedule_day_id = trim(both '-' from regexp_replace(lower(loop_day), '[^a-z0-9]+', '-', 'g'))
where schedule_day_id is null;

update public.workout_entries
set exercise_id = trim(both '-' from regexp_replace(lower(exercise), '[^a-z0-9]+', '-', 'g'))
where exercise_id is null
  and not is_rest_day
  and exercise <> '__WORKOUT_COMPLETE__';

update public.profile_settings settings
set schedule_json = (
  select jsonb_agg(
    case
      when day_item ? 'id' then day_item
      else jsonb_set(
        day_item,
        '{id}',
        to_jsonb(trim(both '-' from regexp_replace(lower(day_item->>'day'), '[^a-z0-9]+', '-', 'g')))
      )
    end
    order by ordinal
  )
  from jsonb_array_elements(settings.schedule_json) with ordinality as days(day_item, ordinal)
)
where jsonb_typeof(schedule_json) = 'array';

alter table public.workout_entries
  alter column schedule_day_id set not null;

alter table public.workout_entries
  drop constraint if exists workout_entries_schedule_day_id_format,
  add constraint workout_entries_schedule_day_id_format
    check (schedule_day_id ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  drop constraint if exists workout_entries_exercise_identity_required,
  add constraint workout_entries_exercise_identity_required
    check (is_rest_day or exercise = '__WORKOUT_COMPLETE__' or exercise_id is not null);

alter table public.profile_settings
  drop constraint if exists profile_settings_expected_sessions_range,
  add constraint profile_settings_expected_sessions_range
    check (expected_sessions_per_week between 0 and 14),
  drop constraint if exists profile_settings_schedule_shape,
  add constraint profile_settings_schedule_shape
    check (
      jsonb_typeof(schedule_json) = 'array'
      and jsonb_array_length(schedule_json) between 1 and 14
    );
