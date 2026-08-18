create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (char_length(btrim(username)) between 2 and 40),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by everyone"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

grant select on public.profiles to anon, authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'username'), ''),
      'user-' || left(new.id::text, 8)
    )
  );
  return new;
end;
$$;

revoke all on function public.create_profile_for_new_user() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

insert into public.profiles (id, username)
select
  id,
  coalesce(
    nullif(btrim(raw_user_meta_data ->> 'username'), ''),
    'user-' || left(id::text, 8)
  )
from auth.users
on conflict (id) do nothing;
