-- Fenix.nfc — 0009 — Row Level Security for every user-facing table.
-- Default posture: deny. Public (anonymous) access to page content, analytics,
-- form submissions and NFC scans is intentionally NOT granted here; it flows
-- through audited SECURITY DEFINER RPCs (see 0010) so drafts and secrets stay
-- private.

-- Extra helper: do two users share any workspace? (no recursion via definer)
create or replace function public.fx_shares_workspace(other uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members a
    join public.workspace_members b on a.workspace_id = b.workspace_id
    where a.user_id = auth.uid() and b.user_id = other
  );
$$;

-- Enable RLS everywhere. -----------------------------------------------------
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;
alter table public.pages enable row level security;
alter table public.blocks enable row level security;
alter table public.page_versions enable row level security;
alter table public.themes enable row level security;
alter table public.brand_kits enable row level security;
alter table public.media enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;
alter table public.leads enable row level security;
alter table public.lead_tags enable row level security;
alter table public.lead_tag_links enable row level security;
alter table public.lead_notes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.nfc_tags enable row level security;
alter table public.nfc_scans enable row level security;
alter table public.qr_configs enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.domains enable row level security;
alter table public.integrations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles -------------------------------------------------------------------
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.fx_shares_workspace(id) or public.fx_is_platform_admin());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Plans (public catalog) -----------------------------------------------------
create policy plans_select on public.plans for select to anon, authenticated using (true);
create policy plans_admin_write on public.plans for all to authenticated
  using (public.fx_is_platform_admin()) with check (public.fx_is_platform_admin());

-- Workspaces -----------------------------------------------------------------
create policy workspaces_select on public.workspaces for select to authenticated
  using (public.fx_is_member(id));
create policy workspaces_insert on public.workspaces for insert to authenticated
  with check (public.fx_is_platform_admin());
create policy workspaces_update on public.workspaces for update to authenticated
  using (public.fx_can_manage(id)) with check (public.fx_can_manage(id));
create policy workspaces_delete on public.workspaces for delete to authenticated
  using (public.fx_is_owner(id));

-- Workspace members ----------------------------------------------------------
create policy members_select on public.workspace_members for select to authenticated
  using (public.fx_is_member(workspace_id));
create policy members_manage on public.workspace_members for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Invitations ----------------------------------------------------------------
create policy invitations_manage on public.invitations for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Generic macro-style policies for workspace-scoped tables. -------------------

-- Pages / blocks / versions (editors).
create policy pages_select on public.pages for select to authenticated using (public.fx_is_member(workspace_id));
create policy pages_write on public.pages for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy blocks_select on public.blocks for select to authenticated using (public.fx_is_member(workspace_id));
create policy blocks_write on public.blocks for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy versions_select on public.page_versions for select to authenticated using (public.fx_is_member(workspace_id));
create policy versions_insert on public.page_versions for insert to authenticated
  with check (public.fx_can_edit(workspace_id));

-- Themes: system themes visible to all authenticated; workspace themes to members.
create policy themes_select on public.themes for select to authenticated
  using (is_system or (workspace_id is not null and public.fx_is_member(workspace_id)));
create policy themes_write on public.themes for all to authenticated
  using (workspace_id is not null and public.fx_can_manage(workspace_id))
  with check (workspace_id is not null and public.fx_can_manage(workspace_id));

create policy brand_kits_select on public.brand_kits for select to authenticated using (public.fx_is_member(workspace_id));
create policy brand_kits_write on public.brand_kits for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Media.
create policy media_select on public.media for select to authenticated using (public.fx_is_member(workspace_id));
create policy media_write on public.media for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Forms.
create policy forms_select on public.forms for select to authenticated using (public.fx_is_member(workspace_id));
create policy forms_write on public.forms for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy form_fields_select on public.form_fields for select to authenticated using (public.fx_is_member(workspace_id));
create policy form_fields_write on public.form_fields for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Submissions: readable by members, no direct client writes (RPC only).
create policy form_submissions_select on public.form_submissions for select to authenticated using (public.fx_is_member(workspace_id));
create policy form_submissions_delete on public.form_submissions for delete to authenticated using (public.fx_can_manage(workspace_id));

-- Leads.
create policy leads_select on public.leads for select to authenticated using (public.fx_is_member(workspace_id));
create policy leads_update on public.leads for update to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy leads_delete on public.leads for delete to authenticated using (public.fx_can_manage(workspace_id));

create policy lead_tags_select on public.lead_tags for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_tags_write on public.lead_tags for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy lead_tag_links_select on public.lead_tag_links for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_tag_links_write on public.lead_tag_links for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy lead_notes_select on public.lead_notes for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_notes_write on public.lead_notes for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Analytics: readable by members; writes via RPC only.
create policy analytics_select on public.analytics_events for select to authenticated using (public.fx_is_member(workspace_id));

-- NFC.
create policy nfc_tags_select on public.nfc_tags for select to authenticated using (public.fx_is_member(workspace_id));
create policy nfc_tags_write on public.nfc_tags for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));
create policy nfc_scans_select on public.nfc_scans for select to authenticated using (public.fx_is_member(workspace_id));

create policy qr_configs_select on public.qr_configs for select to authenticated using (public.fx_is_member(workspace_id));
create policy qr_configs_write on public.qr_configs for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Products.
create policy product_categories_select on public.product_categories for select to authenticated using (public.fx_is_member(workspace_id));
create policy product_categories_write on public.product_categories for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy products_select on public.products for select to authenticated using (public.fx_is_member(workspace_id));
create policy products_write on public.products for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Domains.
create policy domains_select on public.domains for select to authenticated using (public.fx_is_member(workspace_id));
create policy domains_write on public.domains for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Integrations (contain secrets → managers only, even for reads).
create policy integrations_all on public.integrations for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Subscriptions & payments.
create policy subscriptions_select on public.subscriptions for select to authenticated using (public.fx_is_member(workspace_id));
create policy payments_select on public.payments for select to authenticated using (public.fx_can_manage(workspace_id));

-- Notifications (per-user).
create policy notifications_select on public.notifications for select to authenticated
  using (user_id = auth.uid() or (workspace_id is not null and public.fx_can_manage(workspace_id)));
create policy notifications_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy notification_settings_all on public.notification_settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Audit logs (managers read; writes via service role / RPC).
create policy audit_logs_select on public.audit_logs for select to authenticated
  using ((workspace_id is not null and public.fx_can_manage(workspace_id)) or public.fx_is_platform_admin());
