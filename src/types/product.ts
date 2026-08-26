export type WorkspaceRole = "owner" | "administrator" | "editor" | "viewer";

export type PageStatus = "draft" | "published" | "disabled" | "archived";

export type BlockType =
  | "heading"
  | "text"
  | "link"
  | "button"
  | "multi_links"
  | "divider"
  | "spacer"
  | "icon_text"
  | "profile_header"
  | "contact_details"
  | "social_networks"
  | "image"
  | "gallery"
  | "video"
  | "youtube"
  | "file_download"
  | "services"
  | "price_list"
  | "product"
  | "product_grid"
  | "restaurant_menu"
  | "faq"
  | "map"
  | "reviews"
  | "team_members"
  | "form"
  | "cta"
  | "appointment"
  | "newsletter"
  | "internal_page"
  | "external_page"
  | "html"
  | "embed";

export type BlockContent = Record<string, unknown>;
export type BlockDesign = Record<string, unknown>;

export type EditorBlock = {
  id: string;
  type: BlockType;
  page_id: string;
  workspace_id: string;
  position: number;
  content: BlockContent;
  design: BlockDesign;
  is_visible: boolean;
  scheduled_from: string | null;
  scheduled_until: string | null;
  created_at: string;
  updated_at: string;
};

export type PageDesign = {
  theme: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  buttonBackground: string;
  buttonText: string;
  buttonRadius: number;
  cardBackground: string;
  cardBorder: string;
  cardRadius: number;
  pagePadding: number;
  blockSpacing: number;
  contentWidth: number;
  headerAlignment: "left" | "center";
};

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  design: PageDesign;
};

export type PublishedSnapshot = {
  page: Pick<PageRecord, "id" | "workspace_id" | "title" | "slug" | "draft_design">;
  blocks: EditorBlock[];
  publishedAt: string;
};

export type PageRecord = {
  id: string;
  workspace_id: string;
  title: string;
  slug: string;
  status: PageStatus;
  draft_design: PageDesign;
  published_snapshot: PublishedSnapshot | null;
  published_at: string | null;
  updated_at: string;
};

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
