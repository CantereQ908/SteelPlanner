-- Magazyny i zgłoszenia sesji. Uruchom raz w Supabase → SQL Editor, jeśli baza powstała przed tą zmianą.

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null default 'unpublished' check (category in ('unpublished', 'published', 'both')),
  url text not null default '',
  email text not null default '',
  instagram text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  magazine_id uuid not null references public.magazines (id) on delete cascade,
  session_id uuid not null references public.sessions (id) on delete cascade,
  status text not null default 'sent' check (status in ('sent', 'accepted', 'rejected', 'published')),
  sent_date date not null default current_date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.magazines enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "own magazines" on public.magazines;
create policy "own magazines" on public.magazines for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "own submissions" on public.submissions;
create policy "own submissions" on public.submissions for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

do $$
begin
  alter publication supabase_realtime add table public.magazines;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.submissions;
exception
  when duplicate_object then null;
end $$;
