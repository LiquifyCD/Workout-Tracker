alter policy "Users can read their own workout entries"
on public.workout_entries
using ((select auth.uid()) = user_id);

alter policy "Users can insert their own workout entries"
on public.workout_entries
with check ((select auth.uid()) = user_id);

alter policy "Users can update their own workout entries"
on public.workout_entries
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

alter policy "Users can delete their own workout entries"
on public.workout_entries
using ((select auth.uid()) = user_id);

alter policy "Users can read their own profile settings"
on public.profile_settings
using ((select auth.uid()) = user_id);

alter policy "Users can insert their own profile settings"
on public.profile_settings
with check ((select auth.uid()) = user_id);

alter policy "Users can update their own profile settings"
on public.profile_settings
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

alter policy "Users can delete their own profile settings"
on public.profile_settings
using ((select auth.uid()) = user_id);
