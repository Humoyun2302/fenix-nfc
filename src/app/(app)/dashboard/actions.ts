"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMemberRole } from "@/lib/workspace/context";
import { canEdit, canManage } from "@/lib/permissions/roles";
import { slugSchema, isReservedSlug } from "@/lib/validation/workspace";

export type PageActionState = { ok: boolean; error?: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function uniqueSlug(base: string): Promise<string> {
  const supabase = await createClient();
  let candidate = base || "page";
  for (let i = 0; i < 6; i++) {
    const { data } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createPageAction(
  workspaceId: string,
  title: string,
  isInternal = false,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canEdit(role)) return { ok: false, error: "You don't have permission to create pages." };

  const cleanTitle = title.trim().slice(0, 120) || "Untitled page";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slug = await uniqueSlug(slugify(cleanTitle));

  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      workspace_id: workspaceId,
      title: cleanTitle,
      slug,
      is_internal: isInternal,
      created_by: user?.id ?? null,
      design: { themeKey: "minimal-light", headerAlign: "center" },
    })
    .select("id")
    .single();

  if (error || !page) {
    return { ok: false, error: "Could not create the page. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/editor/${page.id}`);
}

export async function renamePageAction(
  pageId: string,
  workspaceId: string,
  title: string,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canEdit(role)) return { ok: false, error: "Permission denied." };

  const clean = title.trim().slice(0, 120);
  if (!clean) return { ok: false, error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ title: clean, has_unpublished_changes: true })
    .eq("id", pageId);
  if (error) return { ok: false, error: "Could not rename the page." };

  revalidatePath("/dashboard");
  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function changeSlugAction(
  pageId: string,
  workspaceId: string,
  slug: string,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canEdit(role)) return { ok: false, error: "Permission denied." };

  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  if (isReservedSlug(parsed.data)) {
    return { ok: false, error: "This URL is reserved. Choose another." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", parsed.data)
    .neq("id", pageId)
    .maybeSingle();
  if (existing) return { ok: false, error: "That URL is already taken." };

  const { error } = await supabase
    .from("pages")
    .update({ slug: parsed.data })
    .eq("id", pageId);
  if (error) return { ok: false, error: "Could not update the URL." };

  revalidatePath(`/editor/${pageId}`);
  return { ok: true };
}

export async function duplicatePageAction(
  pageId: string,
  workspaceId: string,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canEdit(role)) return { ok: false, error: "Permission denied." };

  const supabase = await createClient();
  const { data: source } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .single();
  if (!source) return { ok: false, error: "Page not found." };

  const slug = await uniqueSlug(slugify(`${source.title}-copy`));
  const { data: copy, error } = await supabase
    .from("pages")
    .insert({
      workspace_id: workspaceId,
      title: `${source.title} (copy)`,
      slug,
      is_internal: source.is_internal,
      design: source.design,
      seo: source.seo,
      language: source.language,
    })
    .select("id")
    .single();
  if (error || !copy) return { ok: false, error: "Could not duplicate the page." };

  const { data: blocks } = await supabase
    .from("blocks")
    .select("type, position, content, design, is_visible")
    .eq("page_id", pageId);
  if (blocks && blocks.length > 0) {
    await supabase.from("blocks").insert(
      blocks.map((b) => ({
        workspace_id: workspaceId,
        page_id: copy.id,
        type: b.type,
        position: b.position,
        content: b.content,
        design: b.design,
        is_visible: b.is_visible,
      })),
    );
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function archivePageAction(
  pageId: string,
  workspaceId: string,
  archived: boolean,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canEdit(role)) return { ok: false, error: "Permission denied." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ status: archived ? "archived" : "draft" })
    .eq("id", pageId);
  if (error) return { ok: false, error: "Could not update the page." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deletePageAction(
  pageId: string,
  workspaceId: string,
): Promise<PageActionState> {
  const role = await getMemberRole(workspaceId);
  if (!canManage(role)) return { ok: false, error: "Only admins can delete pages." };

  const supabase = await createClient();
  const { error } = await supabase.from("pages").delete().eq("id", pageId);
  if (error) return { ok: false, error: "Could not delete the page." };

  revalidatePath("/dashboard");
  return { ok: true };
}
