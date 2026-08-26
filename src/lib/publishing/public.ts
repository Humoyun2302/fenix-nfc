import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { EditorBlock } from "@/lib/blocks/types";
import type { PageDesign } from "@/lib/design/theme";
import type { Json } from "@/types/database";

export interface PublishedSnapshot {
  design: PageDesign;
  seo: { title?: string; description?: string; ogImage?: string; favicon?: string };
  title: string;
  language: string;
  blocks: EditorBlock[];
}

export type PublicPageResult =
  | {
      state: "ok";
      pageId: string;
      workspaceId: string;
      slug: string;
      snapshot: PublishedSnapshot;
      themeConfig: Json | null;
    }
  | { state: "not_found" | "unpublished" | "disabled" | "suspended" };

/** Fetch a published page for the public renderer via the audited RPC. */
export async function getPublicPage(slug: string): Promise<PublicPageResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fx_get_public_page", { p_slug: slug });

  if (error || !data || typeof data !== "object") {
    return { state: "not_found" };
  }

  const payload = data as Record<string, unknown>;
  const state = payload.state as string;

  type NonOkState = "not_found" | "unpublished" | "disabled" | "suspended";
  if (state !== "ok") {
    const allowed: NonOkState[] = [
      "not_found",
      "unpublished",
      "disabled",
      "suspended",
    ];
    const next = allowed.includes(state as NonOkState)
      ? (state as NonOkState)
      : "not_found";
    return { state: next };
  }

  const snapshot = normalizeSnapshot(payload.snapshot);

  // Resolve the theme config referenced by the snapshot's design (system themes
  // are publicly readable).
  let themeConfig: Json | null = null;
  const themeKey = snapshot.design.themeKey;
  if (themeKey) {
    const { data: theme } = await supabase
      .from("themes")
      .select("config")
      .eq("key", themeKey)
      .is("workspace_id", null)
      .maybeSingle();
    themeConfig = theme?.config ?? null;
  }

  return {
    state: "ok",
    pageId: String(payload.page_id),
    workspaceId: String(payload.workspace_id),
    slug: String(payload.slug),
    snapshot,
    themeConfig,
  };
}

/** Resolve a username to its home page slug via the RPC. */
export async function resolveUsernameSlug(username: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("fx_username_home_slug", {
    p_username: username,
  });
  return typeof data === "string" ? data : null;
}

function normalizeSnapshot(input: unknown): PublishedSnapshot {
  const raw = (input ?? {}) as Record<string, unknown>;
  const blocks = Array.isArray(raw.blocks)
    ? (raw.blocks as Record<string, unknown>[]).map((b, i) => ({
        id: String(b.id ?? i),
        type: String(b.type) as EditorBlock["type"],
        position: Number(b.position ?? i),
        content: (b.content ?? {}) as EditorBlock["content"],
        design: (b.design ?? {}) as EditorBlock["design"],
        is_visible: true,
        schedule_start: (b.schedule_start as string) ?? null,
        schedule_end: (b.schedule_end as string) ?? null,
      }))
    : [];

  return {
    design: (raw.design ?? {}) as PageDesign,
    seo: (raw.seo ?? {}) as PublishedSnapshot["seo"],
    title: String(raw.title ?? "Page"),
    language: String(raw.language ?? "en"),
    blocks,
  };
}
