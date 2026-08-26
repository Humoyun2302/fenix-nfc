"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMemberRole } from "@/lib/workspace/context";
import { canEdit } from "@/lib/permissions/roles";
import { getBlockDefinition } from "@/lib/blocks/registry";
import { sanitizeHtml } from "@/lib/blocks/sanitize";
import type { BlockContent, BlockDesign } from "@/lib/blocks/types";
import type { PageDesign } from "@/lib/design/theme";
import type { Database, Json } from "@/types/database";

export type EditorActionState<T = undefined> = {
  ok: boolean;
  error?: string;
  data?: T;
};

async function assertEditor(workspaceId: string): Promise<string | null> {
  const role = await getMemberRole(workspaceId);
  return canEdit(role) ? null : "You don't have permission to edit this page.";
}

async function markDirty(pageId: string) {
  const supabase = await createClient();
  await supabase
    .from("pages")
    .update({ has_unpublished_changes: true })
    .eq("id", pageId);
}

export async function addBlockAction(
  workspaceId: string,
  pageId: string,
  type: string,
): Promise<EditorActionState<{ id: string }>> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const def = getBlockDefinition(type);
  if (!def || def.status !== "ready") {
    return { ok: false, error: "This block isn't available yet." };
  }

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("blocks")
    .select("position")
    .eq("page_id", pageId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;

  let content: BlockContent = { ...def.defaultContent };

  // A form/newsletter block needs a real form row to capture leads.
  if (type === "form" || type === "newsletter") {
    const { data: form } = await supabase
      .from("forms")
      .insert({
        workspace_id: workspaceId,
        page_id: pageId,
        name: type === "newsletter" ? "Newsletter" : "Contact form",
      })
      .select("id")
      .single();
    if (form) {
      const fields =
        type === "newsletter"
          ? [{ type: "email", label: "Email", field_key: "email", required: true, position: 0 }]
          : [
              { type: "text", label: "Name", field_key: "name", required: true, position: 0 },
              { type: "tel", label: "Phone", field_key: "phone", required: true, position: 1 },
            ];
      await supabase.from("form_fields").insert(
        fields.map((f) => ({ ...f, form_id: form.id, workspace_id: workspaceId })),
      );
      content = { ...content, formId: form.id };
    }
  }

  const { data: block, error } = await supabase
    .from("blocks")
    .insert({
      workspace_id: workspaceId,
      page_id: pageId,
      type,
      position,
      content: content as Json,
    })
    .select("id")
    .single();

  if (error || !block) return { ok: false, error: "Could not add the block." };

  await markDirty(pageId);
  revalidatePath(`/editor/${pageId}`);
  return { ok: true, data: { id: block.id } };
}

export async function updateBlockAction(
  workspaceId: string,
  pageId: string,
  blockId: string,
  patch: { content?: BlockContent; design?: BlockDesign; is_visible?: boolean },
): Promise<EditorActionState> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const update: Database["public"]["Tables"]["blocks"]["Update"] = {};
  if (patch.content) {
    const content = { ...patch.content };
    if (typeof content.html === "string") {
      content.html = sanitizeHtml(content.html);
    }
    update.content = content as Json;
  }
  if (patch.design) update.design = patch.design as Json;
  if (typeof patch.is_visible === "boolean") update.is_visible = patch.is_visible;

  const supabase = await createClient();
  const { error } = await supabase
    .from("blocks")
    .update(update)
    .eq("id", blockId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not save changes." };

  await markDirty(pageId);
  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function reorderBlocksAction(
  workspaceId: string,
  pageId: string,
  orderedIds: string[],
): Promise<EditorActionState> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  // Persist each block's new position.
  const updates = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("blocks")
        .update({ position: index })
        .eq("id", id)
        .eq("workspace_id", workspaceId),
    ),
  );
  if (updates.some((u) => u.error)) {
    return { ok: false, error: "Could not save the new order." };
  }

  await markDirty(pageId);
  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function duplicateBlockAction(
  workspaceId: string,
  pageId: string,
  blockId: string,
): Promise<EditorActionState> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { data: source } = await supabase
    .from("blocks")
    .select("*")
    .eq("id", blockId)
    .single();
  if (!source) return { ok: false, error: "Block not found." };

  await supabase.from("blocks").insert({
    workspace_id: workspaceId,
    page_id: pageId,
    type: source.type,
    position: source.position + 1,
    content: source.content,
    design: source.design,
    is_visible: source.is_visible,
  });

  await markDirty(pageId);
  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function deleteBlockAction(
  workspaceId: string,
  pageId: string,
  blockId: string,
): Promise<EditorActionState> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { error } = await supabase
    .from("blocks")
    .delete()
    .eq("id", blockId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not delete the block." };

  await markDirty(pageId);
  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function updatePageDesignAction(
  workspaceId: string,
  pageId: string,
  design: PageDesign,
): Promise<EditorActionState> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ design: design as Json, has_unpublished_changes: true })
    .eq("id", pageId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not update design." };

  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function publishPageAction(
  workspaceId: string,
  pageId: string,
  summary?: string,
): Promise<EditorActionState<{ version: number }>> {
  const err = await assertEditor(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fx_publish_page", {
    p_page_id: pageId,
    p_summary: summary,
  });
  if (error || !data) {
    return { ok: false, error: "Could not publish. Please try again." };
  }

  revalidatePath(`/editor/${pageId}`);
  revalidatePath("/dashboard");
  return { ok: true, data: { version: data.version_number } };
}
