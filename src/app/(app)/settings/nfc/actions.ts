"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMemberRole } from "@/lib/workspace/context";
import { canManage } from "@/lib/permissions/roles";
import { generateNfcCode } from "@/lib/nfc/code";

export type NfcActionState = { ok: boolean; error?: string };

async function assertManager(workspaceId: string): Promise<string | null> {
  const role = await getMemberRole(workspaceId);
  return canManage(role) ? null : "You don't have permission to manage NFC tags.";
}

async function log(workspaceId: string, action: string, tagId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    workspace_id: workspaceId,
    actor_id: user?.id ?? null,
    action,
    target_type: "nfc_tag",
    target_id: tagId,
  });
}

export async function createNfcTagAction(
  workspaceId: string,
  name: string,
): Promise<NfcActionState> {
  const err = await assertManager(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  // Generate a unique code (retry on the rare collision).
  let code = generateNfcCode();
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from("nfc_tags")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (!existing) break;
    code = generateNfcCode();
  }

  const { data, error } = await supabase
    .from("nfc_tags")
    .insert({ workspace_id: workspaceId, code, name: name.trim() || "NFC tag" })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "Could not create the tag." };

  await log(workspaceId, "nfc.created", data.id);
  revalidatePath("/settings/nfc");
  return { ok: true };
}

export async function assignNfcTagAction(
  workspaceId: string,
  tagId: string,
  pageId: string | null,
): Promise<NfcActionState> {
  const err = await assertManager(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { error } = await supabase
    .from("nfc_tags")
    .update({ target_type: "page", target_page_id: pageId, target_url: null })
    .eq("id", tagId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not assign the tag." };

  await log(workspaceId, "nfc.assigned", tagId);
  revalidatePath("/settings/nfc");
  return { ok: true };
}

export async function toggleNfcTagAction(
  workspaceId: string,
  tagId: string,
  active: boolean,
): Promise<NfcActionState> {
  const err = await assertManager(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { error } = await supabase
    .from("nfc_tags")
    .update({ status: active ? "active" : "disabled" })
    .eq("id", tagId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not update the tag." };

  await log(workspaceId, active ? "nfc.reactivated" : "nfc.disabled", tagId);
  revalidatePath("/settings/nfc");
  return { ok: true };
}

export async function deleteNfcTagAction(
  workspaceId: string,
  tagId: string,
): Promise<NfcActionState> {
  const err = await assertManager(workspaceId);
  if (err) return { ok: false, error: err };

  const supabase = await createClient();
  const { error } = await supabase
    .from("nfc_tags")
    .delete()
    .eq("id", tagId)
    .eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: "Could not delete the tag." };

  await log(workspaceId, "nfc.deleted", tagId);
  revalidatePath("/settings/nfc");
  return { ok: true };
}
