"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMemberRole } from "@/lib/workspace/context";
import { canManage } from "@/lib/permissions/roles";

export type WorkspaceState = { ok: boolean; error?: string; message?: string };

export async function renameWorkspaceAction(
  _prev: WorkspaceState,
  formData: FormData,
): Promise<WorkspaceState> {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  const role = await getMemberRole(workspaceId);
  if (!canManage(role)) return { ok: false, error: "Permission denied." };
  if (name.length < 2) return { ok: false, error: "Name is too short." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspaces")
    .update({ name: name.slice(0, 80) })
    .eq("id", workspaceId);
  if (error) return { ok: false, error: "Could not update the workspace." };

  revalidatePath("/settings/workspace");
  revalidatePath("/", "layout");
  return { ok: true, message: "Workspace updated." };
}
