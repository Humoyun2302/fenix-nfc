/**
 * Fenix.nfc database types.
 *
 * Hand-authored to mirror the SQL migrations in `supabase/migrations`. Row
 * shapes are declared as `type` aliases (not interfaces) so they satisfy the
 * Supabase client's `Record<string, unknown>` constraints. Keep in sync when
 * the schema changes (or regenerate with `supabase gen types`).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum unions ---------------------------------------------------------------
export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer";
export type WorkspaceStatus = "active" | "suspended";
export type InvitationStatus = "pending" | "accepted" | "cancelled" | "expired";
export type PageStatus = "draft" | "published" | "disabled" | "archived";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type NfcStatus = "active" | "disabled";
export type NfcTarget = "page" | "url";
export type DomainStatus =
  | "pending"
  | "verification_required"
  | "verifying"
  | "active"
  | "ssl_pending"
  | "failed"
  | "disconnected";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "canceled"
  | "refunded";
export type IntegrationType =
  | "telegram"
  | "email"
  | "webhook"
  | "google_analytics"
  | "gtm"
  | "meta_pixel"
  | "tiktok_pixel";
export type AnalyticsEventType =
  | "page_view"
  | "unique_visitor"
  | "link_click"
  | "button_click"
  | "product_click"
  | "form_start"
  | "form_submission"
  | "nfc_scan"
  | "qr_redirect"
  | "payment_start"
  | "payment_success";

type Timestamps = { created_at: string; updated_at: string };

// Row shapes ----------------------------------------------------------------
export type ProfileRow = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  locale: string;
  is_platform_admin: boolean;
};

export type PlanRow = Timestamps & {
  id: string;
  key: string;
  name: string;
  price: number;
  currency: string;
  billing_interval: string;
  limits: Json;
  features: Json;
  is_active: boolean;
  sort_order: number;
};

export type WorkspaceRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  owner_id: string | null;
  plan_id: string | null;
  status: WorkspaceStatus;
  is_claimed: boolean;
  claim_email: string | null;
  claimed_at: string | null;
  logo_url: string | null;
  created_by: string | null;
};

export type WorkspaceMemberRow = Timestamps & {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  invited_by: string | null;
};

export type InvitationRow = Timestamps & {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  status: InvitationStatus;
  is_ownership_claim: boolean;
  expires_at: string;
  invited_by: string | null;
  accepted_by: string | null;
  accepted_at: string | null;
};

export type PageRow = Timestamps & {
  id: string;
  workspace_id: string;
  title: string;
  slug: string;
  is_internal: boolean;
  status: PageStatus;
  design: Json;
  seo: Json;
  language: string;
  published_version_id: string | null;
  published_at: string | null;
  published_by: string | null;
  has_unpublished_changes: boolean;
  sort_order: number;
  created_by: string | null;
};

export type BlockRow = Timestamps & {
  id: string;
  workspace_id: string;
  page_id: string;
  type: string;
  position: number;
  content: Json;
  design: Json;
  is_visible: boolean;
  schedule_start: string | null;
  schedule_end: string | null;
};

export type PageVersionRow = {
  id: string;
  page_id: string;
  workspace_id: string;
  version_number: number;
  snapshot: Json;
  change_summary: string | null;
  published_by: string | null;
  created_at: string;
};

export type ThemeRow = Timestamps & {
  id: string;
  workspace_id: string | null;
  key: string;
  name: string;
  config: Json;
  is_system: boolean;
  preview: Json;
  sort_order: number;
};

export type BrandKitRow = Timestamps & {
  id: string;
  workspace_id: string;
  name: string;
  config: Json;
  is_default: boolean;
  created_by: string | null;
};

export type MediaRow = Timestamps & {
  id: string;
  workspace_id: string;
  bucket: string;
  path: string;
  url: string | null;
  kind: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  filename: string | null;
  created_by: string | null;
};

export type FormRow = Timestamps & {
  id: string;
  workspace_id: string;
  page_id: string | null;
  block_id: string | null;
  name: string;
  submit_label: string;
  success_message: string;
  notify: Json;
  spam_protection: boolean;
  is_active: boolean;
};

export type FormFieldRow = Timestamps & {
  id: string;
  form_id: string;
  workspace_id: string;
  type: string;
  label: string;
  field_key: string;
  placeholder: string | null;
  required: boolean;
  options: Json;
  position: number;
};

export type FormSubmissionRow = {
  id: string;
  workspace_id: string;
  form_id: string;
  page_id: string | null;
  block_id: string | null;
  data: Json;
  visitor_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type LeadRow = Timestamps & {
  id: string;
  workspace_id: string;
  page_id: string | null;
  block_id: string | null;
  submission_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  data: Json;
  status: LeadStatus;
  utm: Json;
  referrer: string | null;
};

export type LeadTagRow = {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type LeadTagLinkRow = {
  lead_id: string;
  tag_id: string;
  workspace_id: string;
};

export type LeadNoteRow = {
  id: string;
  lead_id: string;
  workspace_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type AnalyticsEventRow = {
  id: string;
  workspace_id: string;
  page_id: string | null;
  block_id: string | null;
  type: AnalyticsEventType;
  visitor_id: string | null;
  session_id: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  referrer: string | null;
  utm: Json;
  meta: Json;
  created_at: string;
};

export type NfcTagRow = Timestamps & {
  id: string;
  workspace_id: string;
  code: string;
  name: string;
  table_number: string | null;
  target_type: NfcTarget;
  target_page_id: string | null;
  target_url: string | null;
  status: NfcStatus;
  notes: string | null;
  total_scans: number;
  unique_scans: number;
  last_scan_at: string | null;
};

export type NfcScanRow = {
  id: string;
  tag_id: string;
  workspace_id: string;
  visitor_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  country: string | null;
  referrer: string | null;
  created_at: string;
};

export type QrConfigRow = Timestamps & {
  id: string;
  workspace_id: string;
  name: string;
  target_type: string;
  target_ref: string;
  options: Json;
  created_by: string | null;
};

export type ProductCategoryRow = Timestamps & {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type ProductRow = Timestamps & {
  id: string;
  workspace_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  old_price: number | null;
  currency: string;
  images: Json;
  sku: string | null;
  quantity: number | null;
  availability: boolean;
  product_type: string;
  is_featured: boolean;
  badges: Json;
  sizes: Json;
  addons: Json;
  translations: Json;
  sort_order: number;
};

export type DomainRow = Timestamps & {
  id: string;
  workspace_id: string;
  page_id: string | null;
  hostname: string;
  status: DomainStatus;
  verification_token: string;
  ssl_status: string;
  verified_at: string | null;
};

export type IntegrationRow = Timestamps & {
  id: string;
  workspace_id: string;
  type: IntegrationType;
  config: Json;
  status: string;
  last_test_at: string | null;
  last_error: string | null;
  created_by: string | null;
};

export type SubscriptionRow = Timestamps & {
  id: string;
  workspace_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  is_lifetime: boolean;
  current_period_start: string;
  current_period_end: string | null;
  cancel_at: string | null;
  granted_by: string | null;
};

export type PaymentRow = Timestamps & {
  id: string;
  workspace_id: string;
  subscription_id: string | null;
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  external_id: string | null;
  meta: Json;
};

export type NotificationRow = {
  id: string;
  workspace_id: string | null;
  user_id: string | null;
  type: string;
  title: string;
  body: string | null;
  data: Json;
  read_at: string | null;
  created_at: string;
};

export type NotificationSettingRow = Timestamps & {
  id: string;
  workspace_id: string;
  user_id: string;
  config: Json;
};

export type AuditLogRow = {
  id: string;
  workspace_id: string | null;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Json;
  created_at: string;
};

// Helper: build a Supabase-style {Row, Insert, Update, Relationships} table. --
type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

/**
 * Insert/Update payloads are intentionally permissive: every column is optional
 * because Postgres supplies defaults (ids, timestamps, status, jsonb, etc.) and
 * NOT NULL / CHECK constraints are enforced at the database layer. This mirrors
 * the ergonomics of Supabase-generated types without over-constraining inserts.
 */
type Insertable<Row> = Partial<Row>;
type Updatable<Row> = Partial<Row>;

type T<Row> = TableDef<Row, Insertable<Row>, Updatable<Row>>;

export interface Database {
  public: {
    Tables: {
      profiles: T<ProfileRow>;
      plans: T<PlanRow>;
      workspaces: T<WorkspaceRow>;
      workspace_members: T<WorkspaceMemberRow>;
      invitations: T<InvitationRow>;
      pages: T<PageRow>;
      blocks: T<BlockRow>;
      page_versions: TableDef<
        PageVersionRow,
        Insertable<PageVersionRow>,
        Updatable<PageVersionRow>
      >;
      themes: T<ThemeRow>;
      brand_kits: T<BrandKitRow>;
      media: T<MediaRow>;
      forms: T<FormRow>;
      form_fields: T<FormFieldRow>;
      form_submissions: TableDef<
        FormSubmissionRow,
        Insertable<FormSubmissionRow>,
        Updatable<FormSubmissionRow>
      >;
      leads: T<LeadRow>;
      lead_tags: TableDef<LeadTagRow, Insertable<LeadTagRow>, Updatable<LeadTagRow>>;
      lead_tag_links: TableDef<
        LeadTagLinkRow,
        LeadTagLinkRow,
        Partial<LeadTagLinkRow>
      >;
      lead_notes: TableDef<
        LeadNoteRow,
        Insertable<LeadNoteRow>,
        Updatable<LeadNoteRow>
      >;
      analytics_events: TableDef<
        AnalyticsEventRow,
        Insertable<AnalyticsEventRow>,
        Updatable<AnalyticsEventRow>
      >;
      nfc_tags: T<NfcTagRow>;
      nfc_scans: TableDef<NfcScanRow, Insertable<NfcScanRow>, Updatable<NfcScanRow>>;
      qr_configs: T<QrConfigRow>;
      product_categories: T<ProductCategoryRow>;
      products: T<ProductRow>;
      domains: T<DomainRow>;
      integrations: T<IntegrationRow>;
      subscriptions: T<SubscriptionRow>;
      payments: T<PaymentRow>;
      notifications: TableDef<
        NotificationRow,
        Insertable<NotificationRow>,
        Updatable<NotificationRow>
      >;
      notification_settings: T<NotificationSettingRow>;
      audit_logs: TableDef<
        AuditLogRow,
        Insertable<AuditLogRow>,
        Updatable<AuditLogRow>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      fx_create_workspace: {
        Args: { p_name: string };
        Returns: WorkspaceRow;
      };
      fx_publish_page: {
        Args: { p_page_id: string; p_summary?: string };
        Returns: PageVersionRow;
      };
      fx_accept_invitation: {
        Args: { p_token: string };
        Returns: string;
      };
      fx_get_public_page: {
        Args: { p_slug: string };
        Returns: Json;
      };
      fx_username_home_slug: {
        Args: { p_username: string };
        Returns: string;
      };
      fx_track_event: {
        Args: { payload: Json };
        Returns: undefined;
      };
      fx_submit_form: {
        Args: { payload: Json };
        Returns: Json;
      };
      fx_resolve_nfc: {
        Args: { payload: Json };
        Returns: Json;
      };
    };
    Enums: {
      workspace_role: WorkspaceRole;
      workspace_status: WorkspaceStatus;
      invitation_status: InvitationStatus;
      page_status: PageStatus;
      lead_status: LeadStatus;
      nfc_status: NfcStatus;
      nfc_target: NfcTarget;
      domain_status: DomainStatus;
      subscription_status: SubscriptionStatus;
      payment_status: PaymentStatus;
      integration_type: IntegrationType;
      analytics_event_type: AnalyticsEventType;
    };
    CompositeTypes: Record<string, never>;
  };
}
