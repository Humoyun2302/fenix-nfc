-- Fenix.nfc — 0010 — triggers, workspace bootstrap, publishing, invitations,
-- and audited public RPCs for anonymous visitors.

-- Slugify helper. ------------------------------------------------------------
create or replace function public.fx_slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g')
  );
$$;

-- Create a profile automatically when an auth user is created. ---------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := public.fx_slugify(split_part(new.email, '@', 1));
  if base_username = '' then
    base_username := 'user';
  end if;
  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, email, full_name, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    candidate,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bootstrap a workspace for the current user (owner + free subscription). -----
create or replace function public.fx_create_workspace(p_name text)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_slug text;
  v_base text;
  v_suffix int := 0;
  v_plan uuid;
  v_ws public.workspaces;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  v_base := public.fx_slugify(p_name);
  if v_base = '' then v_base := 'workspace'; end if;
  v_slug := v_base;
  while exists (select 1 from public.workspaces where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base || '-' || v_suffix::text;
  end loop;

  select id into v_plan from public.plans where key = 'free' limit 1;

  insert into public.workspaces (name, slug, owner_id, created_by, plan_id, is_claimed, claimed_at)
  values (coalesce(nullif(trim(p_name), ''), 'My workspace'), v_slug, v_uid, v_uid, v_plan, true, now())
  returning * into v_ws;

  insert into public.workspace_members (workspace_id, user_id, role, invited_by)
  values (v_ws.id, v_uid, 'owner', v_uid);

  if v_plan is not null then
    insert into public.subscriptions (workspace_id, plan_id, status)
    values (v_ws.id, v_plan, 'active')
    on conflict (workspace_id) do nothing;
  end if;

  return v_ws;
end;
$$;

-- Publish a page: snapshot current draft (design + blocks) into a version. ----
create or replace function public.fx_publish_page(p_page_id uuid, p_summary text default null)
returns public.page_versions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_page public.pages;
  v_next int;
  v_snapshot jsonb;
  v_version public.page_versions;
begin
  select * into v_page from public.pages where id = p_page_id;
  if not found then
    raise exception 'Page not found' using errcode = 'P0002';
  end if;
  if not public.fx_can_edit(v_page.workspace_id) then
    raise exception 'Not authorized to publish this page' using errcode = '42501';
  end if;

  select coalesce(max(version_number), 0) + 1 into v_next
  from public.page_versions where page_id = p_page_id;

  select jsonb_build_object(
    'design', v_page.design,
    'seo', v_page.seo,
    'title', v_page.title,
    'language', v_page.language,
    'blocks', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'type', b.type,
            'position', b.position,
            'content', b.content,
            'design', b.design,
            'schedule_start', b.schedule_start,
            'schedule_end', b.schedule_end
          ) order by b.position
        )
        from public.blocks b
        where b.page_id = p_page_id and b.is_visible = true
      ),
      '[]'::jsonb
    )
  ) into v_snapshot;

  insert into public.page_versions (page_id, workspace_id, version_number, snapshot, change_summary, published_by)
  values (p_page_id, v_page.workspace_id, v_next, v_snapshot, p_summary, auth.uid())
  returning * into v_version;

  update public.pages
  set published_version_id = v_version.id,
      published_at = now(),
      published_by = auth.uid(),
      status = 'published',
      has_unpublished_changes = false
  where id = p_page_id;

  return v_version;
end;
$$;

-- Accept an invitation / claim a prepared workspace. --------------------------
create or replace function public.fx_accept_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email citext;
  v_inv public.invitations;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select * into v_inv from public.invitations where token = p_token;
  if not found then
    raise exception 'Invitation not found' using errcode = 'P0002';
  end if;
  if v_inv.status <> 'pending' then
    raise exception 'Invitation is no longer valid' using errcode = 'P0001';
  end if;
  if v_inv.expires_at < now() then
    update public.invitations set status = 'expired' where id = v_inv.id;
    raise exception 'Invitation has expired' using errcode = 'P0001';
  end if;

  select email into v_email from public.profiles where id = v_uid;

  if v_inv.is_ownership_claim then
    update public.workspaces
    set owner_id = v_uid, is_claimed = true, claimed_at = now()
    where id = v_inv.workspace_id;

    insert into public.workspace_members (workspace_id, user_id, role, invited_by)
    values (v_inv.workspace_id, v_uid, 'owner', v_inv.invited_by)
    on conflict (workspace_id, user_id) do update set role = 'owner';
  else
    insert into public.workspace_members (workspace_id, user_id, role, invited_by)
    values (v_inv.workspace_id, v_uid, v_inv.role, v_inv.invited_by)
    on conflict (workspace_id, user_id) do update set role = excluded.role;
  end if;

  update public.invitations
  set status = 'accepted', accepted_by = v_uid, accepted_at = now()
  where id = v_inv.id;

  insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, meta)
  values (v_inv.workspace_id, v_uid, 'invitation.accepted', 'invitation', v_inv.id::text,
          jsonb_build_object('ownership_claim', v_inv.is_ownership_claim));

  return v_inv.workspace_id;
end;
$$;

-- PUBLIC RPC: fetch a published page by slug (anonymous-safe). ----------------
create or replace function public.fx_get_public_page(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_page public.pages;
  v_ws public.workspaces;
  v_snapshot jsonb;
begin
  select * into v_page from public.pages where slug = p_slug;
  if not found then
    return jsonb_build_object('state', 'not_found');
  end if;

  select * into v_ws from public.workspaces where id = v_page.workspace_id;
  if v_ws.status <> 'active' then
    return jsonb_build_object('state', 'suspended');
  end if;
  if v_page.status = 'disabled' then
    return jsonb_build_object('state', 'disabled');
  end if;
  if v_page.status = 'archived' then
    return jsonb_build_object('state', 'not_found');
  end if;
  if v_page.published_version_id is null then
    return jsonb_build_object('state', 'unpublished');
  end if;

  select snapshot into v_snapshot from public.page_versions where id = v_page.published_version_id;

  return jsonb_build_object(
    'state', 'ok',
    'page_id', v_page.id,
    'workspace_id', v_page.workspace_id,
    'slug', v_page.slug,
    'snapshot', v_snapshot
  );
end;
$$;

-- Resolve a username to its home (lowest sort_order published) page slug. -----
create or replace function public.fx_username_home_slug(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.slug
  from public.profiles pr
  join public.workspaces w on w.owner_id = pr.id and w.status = 'active'
  join public.pages p on p.workspace_id = w.id
    and p.status = 'published' and p.published_version_id is not null
  where pr.username = p_username
  order by p.sort_order asc, p.created_at asc
  limit 1;
$$;

-- PUBLIC RPC: record an analytics event. -------------------------------------
create or replace function public.fx_track_event(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ws uuid := (payload ->> 'workspace_id')::uuid;
begin
  if v_ws is null or not public.fx_workspace_active(v_ws) then
    return;
  end if;
  insert into public.analytics_events (
    workspace_id, page_id, block_id, type, visitor_id, session_id,
    device, browser, os, country, referrer, utm, meta
  ) values (
    v_ws,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    (payload ->> 'type')::public.analytics_event_type,
    payload ->> 'visitor_id',
    payload ->> 'session_id',
    payload ->> 'device',
    payload ->> 'browser',
    payload ->> 'os',
    payload ->> 'country',
    payload ->> 'referrer',
    coalesce(payload -> 'utm', '{}'::jsonb),
    coalesce(payload -> 'meta', '{}'::jsonb)
  );
end;
$$;

-- PUBLIC RPC: submit a form → submission + lead + conversion event. ----------
create or replace function public.fx_submit_form(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_form public.forms;
  v_data jsonb := coalesce(payload -> 'data', '{}'::jsonb);
  v_submission_id uuid;
begin
  select * into v_form from public.forms where id = (payload ->> 'form_id')::uuid;
  if not found or not v_form.is_active then
    raise exception 'Form is not available' using errcode = 'P0001';
  end if;
  if not public.fx_workspace_active(v_form.workspace_id) then
    raise exception 'Workspace is not active' using errcode = 'P0001';
  end if;

  insert into public.form_submissions (
    workspace_id, form_id, page_id, block_id, data, visitor_id, ip_hash, user_agent
  ) values (
    v_form.workspace_id, v_form.id,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    v_data,
    payload ->> 'visitor_id',
    payload ->> 'ip_hash',
    payload ->> 'user_agent'
  ) returning id into v_submission_id;

  insert into public.leads (
    workspace_id, page_id, block_id, submission_id, name, phone, email, data, utm, referrer
  ) values (
    v_form.workspace_id,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    v_submission_id,
    coalesce(v_data ->> 'name', v_data ->> 'full_name'),
    coalesce(v_data ->> 'phone', v_data ->> 'tel'),
    nullif(v_data ->> 'email', ''),
    v_data,
    coalesce(payload -> 'utm', '{}'::jsonb),
    payload ->> 'referrer'
  );

  perform public.fx_track_event(jsonb_build_object(
    'workspace_id', v_form.workspace_id,
    'page_id', payload ->> 'page_id',
    'block_id', payload ->> 'block_id',
    'type', 'form_submission',
    'visitor_id', payload ->> 'visitor_id'
  ));

  return jsonb_build_object('ok', true, 'submission_id', v_submission_id);
end;
$$;

-- PUBLIC RPC: resolve an NFC code, record the scan, return the destination. ---
create or replace function public.fx_resolve_nfc(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tag public.nfc_tags;
  v_slug text;
  v_visitor text := payload ->> 'visitor_id';
  v_is_unique boolean := false;
begin
  select * into v_tag from public.nfc_tags where code = payload ->> 'code';
  if not found then
    return jsonb_build_object('state', 'not_found');
  end if;
  if v_tag.status <> 'active' then
    return jsonb_build_object('state', 'disabled');
  end if;
  if not public.fx_workspace_active(v_tag.workspace_id) then
    return jsonb_build_object('state', 'suspended');
  end if;

  if v_visitor is not null then
    v_is_unique := not exists (
      select 1 from public.nfc_scans where tag_id = v_tag.id and visitor_id = v_visitor
    );
  end if;

  insert into public.nfc_scans (tag_id, workspace_id, visitor_id, ip_hash, user_agent, country, referrer)
  values (v_tag.id, v_tag.workspace_id, v_visitor, payload ->> 'ip_hash',
          payload ->> 'user_agent', payload ->> 'country', payload ->> 'referrer');

  update public.nfc_tags
  set total_scans = total_scans + 1,
      unique_scans = unique_scans + (case when v_is_unique then 1 else 0 end),
      last_scan_at = now()
  where id = v_tag.id;

  perform public.fx_track_event(jsonb_build_object(
    'workspace_id', v_tag.workspace_id,
    'type', 'nfc_scan',
    'visitor_id', v_visitor,
    'meta', jsonb_build_object('tag_id', v_tag.id)
  ));

  if v_tag.target_type = 'url' then
    return jsonb_build_object('state', 'ok', 'target_type', 'url', 'url', v_tag.target_url);
  end if;

  select slug into v_slug from public.pages where id = v_tag.target_page_id;
  if v_slug is null then
    return jsonb_build_object('state', 'not_found');
  end if;
  return jsonb_build_object('state', 'ok', 'target_type', 'page', 'slug', v_slug);
end;
$$;

-- Restrict + expose RPCs appropriately. --------------------------------------
revoke all on function public.fx_create_workspace(text) from anon;
revoke all on function public.fx_publish_page(uuid, text) from anon;
revoke all on function public.fx_accept_invitation(text) from anon;

grant execute on function public.fx_get_public_page(text) to anon, authenticated;
grant execute on function public.fx_username_home_slug(text) to anon, authenticated;
grant execute on function public.fx_track_event(jsonb) to anon, authenticated;
grant execute on function public.fx_submit_form(jsonb) to anon, authenticated;
grant execute on function public.fx_resolve_nfc(jsonb) to anon, authenticated;
