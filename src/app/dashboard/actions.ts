"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultDesign } from "@/lib/product-data";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { pageSchema, workspaceSchema } from "@/lib/validation/schemas";

export async function createWorkspaceAction(formData: FormData) {
  const parsed = workspaceSchema.parse({ name: String(formData.get("name") ?? "") });
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("You must be signed in.");

  const slug = slugify(parsed.name) || `workspace-${crypto.randomUUID().slice(0, 8)}`;
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({ name: parsed.name, slug, status: "active", owner_id: user.id })
    .select("id")
    .single();
  if (error) throw new Error("Workspace could not be created.");

  const { error: memberError } = await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  });
  if (memberError) throw new Error("Workspace member could not be created.");

  revalidatePath("/dashboard");
}

export async function createPageAction(formData: FormData) {
  const parsed = pageSchema.parse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? formData.get("title") ?? ""),
  });
  const workspaceId = String(formData.get("workspaceId") ?? "");
  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      workspace_id: workspaceId,
      title: parsed.title,
      slug: parsed.slug,
      status: "draft",
      draft_design: defaultDesign,
    })
    .select("id")
    .single();

  if (error) throw new Error("Page could not be created.");
  revalidatePath("/dashboard");
  redirect(`/editor/${page.id}`);
}
