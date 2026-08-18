-- These functions run only as auth/event triggers. They are not browser RPCs.
revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
