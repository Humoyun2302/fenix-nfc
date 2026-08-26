import type { Json } from "@/types/database";

/** Every block type Fenix.nfc knows about. */
export type BlockType =
  // Basic
  | "text"
  | "heading"
  | "link"
  | "button"
  | "link-list"
  | "divider"
  | "spacer"
  | "icon-text"
  // Profile
  | "avatar"
  | "profile-header"
  | "contact-details"
  | "social-links"
  | "messengers"
  | "phone"
  | "email"
  | "address"
  | "working-hours"
  // Media
  | "image"
  | "gallery"
  | "carousel"
  | "video"
  | "youtube"
  | "audio"
  | "file"
  | "banner"
  // Business
  | "services"
  | "price-list"
  | "product"
  | "product-grid"
  | "menu"
  | "faq"
  | "map"
  | "countdown"
  | "reviews"
  | "team"
  // Conversion
  | "form"
  | "payment"
  | "cta"
  | "appointment"
  | "order"
  | "newsletter"
  // Navigation
  | "internal-page"
  | "external-page"
  | "custom-url"
  | "anchor"
  // Advanced
  | "html"
  | "code"
  | "embed"
  | "layout";

export type BlockCategory =
  | "basic"
  | "profile"
  | "media"
  | "business"
  | "conversion"
  | "navigation"
  | "advanced";

/** Editor availability. Only "ready" blocks are addable in production. */
export type BlockStatus = "ready" | "soon";

export interface BlockContent {
  [key: string]: Json | undefined;
}

export interface BlockDesign {
  background?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
  width?: "full" | "wide" | "narrow";
  radius?: number;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  border?: boolean;
}

export interface EditorBlock {
  id: string;
  type: BlockType;
  position: number;
  content: BlockContent;
  design: BlockDesign;
  is_visible: boolean;
  schedule_start: string | null;
  schedule_end: string | null;
}

export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  /** Lucide icon name, resolved in the UI layer. */
  icon: string;
  status: BlockStatus;
  premium?: boolean;
  defaultContent: BlockContent;
  defaultDesign?: BlockDesign;
}
