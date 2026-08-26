"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createWorkspaceSchema, slugSchema } from "@/lib/validation/workspace";
import { getBlockDefinition } from "@/lib/blocks/registry";

export type OnboardingState = { ok: boolean; error?: string };

function randomSlugSuffix() {
  return Math.random().toString(36).slice(2, 7);
}

/**
 * Creates the user's first workspace (via the SECURITY DEFINER RPC) plus a
 * starter page with a couple of blocks, then sends them into the editor.
 */
export async function createFirstWorkspaceAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const parsed = createWorkspaceSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { data: workspace, error } = await supabase.rpc("fx_create_workspace", {
    p_name: parsed.data.name,
  });
  if (error || !workspace) {
    return { ok: false, error: "Could not create workspace. Please try again." };
  }

  // Create a starter page.
  const baseSlug = slugSchema.safeParse(parsed.data.name.toLowerCase());
  const slug = `${baseSlug.success ? baseSlug.data : "page"}-${randomSlugSuffix()}`;

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .insert({
      workspace_id: workspace.id,
      title: parsed.data.name,
      slug,
      created_by: user.id,
      design: { themeKey: "minimal-light", headerAlign: "center" },
    })
    .select("id")
    .single();

  if (pageError || !page) {
    // Workspace exists; send them to the dashboard to create a page manually.
    redirect("/dashboard");
  }

  const header = getBlockDefinition("profile-header");
  const button = getBlockDefinition("button");
  if (header && button) {
    await supabase.from("blocks").insert([
      {
        workspace_id: workspace.id,
        page_id: page.id,
        type: "profile-header",
        position: 0,
        content: { ...header.defaultContent, name: parsed.data.name },
      },
      {
        workspace_id: workspace.id,
        page_id: page.id,
        type: "button",
        position: 1,
        content: button.defaultContent,
      },
    ]);
  }

  redirect(`/editor/${page.id}`);
}
