-- Fenix.nfc — 0005 — media, forms, submissions, leads.

create table public.media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  bucket text not null default 'media',
  path text not null,
  url text,
  kind text not null default 'image',
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  filename text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_workspace_idx on public.media (workspace_id);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  name text not null default 'Untitled form',
  submit_label text not null default 'Send',
  success_message text not null default 'Thank you! We will be in touch.',
  notify jsonb not null default '{}'::jsonb,
  spam_protection boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index forms_workspace_idx on public.forms (workspace_id);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  type text not null,
  label text not null,
  field_key text not null,
  placeholder text,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, field_key)
);
create index form_fields_form_idx on public.form_fields (form_id, position);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  form_id uuid not null references public.forms (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  visitor_id text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index form_submissions_form_idx on public.form_submissions (form_id, created_at desc);
create index form_submissions_workspace_idx on public.form_submissions (workspace_id);

create table public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  color text not null default '#858B92',
  created_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  submission_id uuid references public.form_submissions (id) on delete set null,
  name text,
  phone text,
  email citext,
  data jsonb not null default '{}'::jsonb,
  status public.lead_status not null default 'new',
  utm jsonb not null default '{}'::jsonb,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_workspace_idx on public.leads (workspace_id, created_at desc);
create index leads_status_idx on public.leads (workspace_id, status);

create table public.lead_tag_links (
  lead_id uuid not null references public.leads (id) on delete cascade,
  tag_id uuid not null references public.lead_tags (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  primary key (lead_id, tag_id)
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

create trigger set_updated_at before update on public.media
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.forms
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.form_fields
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.leads
  for each row execute function public.fx_set_updated_at();
