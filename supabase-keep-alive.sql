-- Keep-alive row for the Netlify daily ping.
-- Run this in each Supabase project's SQL editor (Project 1 and, if used, Project 2).
-- The scheduled function only SELECTs this table; it does not write application data.

create table if not exists public.keep_alive (
  id bigint primary key,
  updated_at timestamptz default now()
);

insert into public.keep_alive (id)
values (1)
on conflict (id) do nothing;
