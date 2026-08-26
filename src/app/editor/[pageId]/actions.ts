"use server";

import { revalidatePath } from "next/cache";
import { defaultBlockContent, themePresets } from "@/lib/product-data";
import { createPublishedSnapshot } from "@/lib/publishing";
import { createClient } from "@/lib/supabase/server";
import { blockSchema, blockUpdateSchema, reorderSchema } from "@/lib/validation/schemas";
import type { EditorBlock, PageDesign, PageRecord } from "@/types/product";

function asBlock(row: unknown) {
  return row as EditorBlock;
}

function asPage(row: unknown) {
  return row as PageRecord;
}

export async function addBlockAction(input: { pageId: string; type: string }) {
  const parsed = blockSchema.parse(input);
  const supabase = await createClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, workspace_id")
    .eq("id", parsed.pageId)
    .single();
  if (pageError || !page) throw new Error("Page not found.");

  const { count } = await supabase
    .from("blocks")
    .select("id", { count: "exact", head: true })
    .eq("page_id", parsed.pageId);

  const { error } = await supabase.from("blocks").insert({
    page_id: parsed.pageId,
    workspace_id: page.workspace_id,
    type: parsed.type,
    position: count ?? 0,
    content: defaultBlockContent(parsed.type),
    design: {},
    is_visible: true,
  });
  if (error) throw new Error("Block could not be added.");
  revalidatePath(`/editor/${parsed.pageId}`);
}

export async function updateBlockAction(input: {
  blockId: string;
  content: Record<string, unknown>;
  design?: Record<string, unknown>;
  isVisible?: boolean;
}) {
  const parsed = blockUpdateSchema.parse(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocks")
    .update({
      content: parsed.content,
      design: parsed.design,
      is_visible: parsed.isVisible,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.blockId)
    .select("page_id")
    .single();
  if (error) throw new Error("Block could not be saved.");
  revalidatePath(`/editor/${data.page_id}`);
}

export async function reorderBlocksAction(input: { pageId: string; orderedIds: string[] }) {
  const parsed = reorderSchema.parse(input);
  const supabase = await createClient();

  const updates = parsed.orderedIds.map((id, position) =>
    supabase.from("blocks").update({ position }).eq("id", id).eq("page_id", parsed.pageId),
  );
  const results = await Promise.all(updates);
  if (results.some((result) => result.error)) throw new Error("Block order could not be saved.");
  revalidatePath(`/editor/${parsed.pageId}`);
}

export async function applyThemeAction(pageId: string, themeId: string) {
  const theme = themePresets.find((item) => item.id === themeId);
  if (!theme) throw new Error("Theme not found.");
  const supabase = await createClient();
  const { error } = await supabase.from("pages").update({ draft_design: theme.design }).eq("id", pageId);
  if (error) throw new Error("Theme could not be applied.");
  revalidatePath(`/editor/${pageId}`);
}

export async function updateDesignAction(pageId: string, design: PageDesign) {
  const supabase = await createClient();
  const { error } = await supabase.from("pages").update({ draft_design: design }).eq("id", pageId);
  if (error) throw new Error("Design could not be saved.");
  revalidatePath(`/editor/${pageId}`);
}

export async function publishPageAction(pageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  const { data: pageRow, error: pageError } = await supabase.from("pages").select("*").eq("id", pageId).single();
  if (pageError || !pageRow) throw new Error("Page not found.");

  const { data: blockRows, error: blockError } = await supabase
    .from("blocks")
    .select("*")
    .eq("page_id", pageId)
    .order("position");
  if (blockError) throw new Error("Blocks could not be loaded.");

  const snapshot = createPublishedSnapshot(asPage(pageRow), (blockRows ?? []).map(asBlock));
  const { error } = await supabase
    .from("pages")
    .update({
      status: "published",
      published_snapshot: snapshot,
      published_at: snapshot.publishedAt,
      published_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId);
  if (error) throw new Error("Page could not be published.");
  await supabase.from("page_versions").insert({
    page_id: pageId,
    workspace_id: pageRow.workspace_id,
    snapshot,
    change_summary: "Published from editor",
    created_by: user.id,
  });
  revalidatePath(`/editor/${pageId}`);
  revalidatePath(`/p/${pageRow.slug}`);
}
