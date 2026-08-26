"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMemberRole } from "@/lib/workspace/context";
import { canManage } from "@/lib/permissions/roles";
import { inviteSchema } from "@/lib/validation/workspace";
import { siteUrl } from "@/lib/env";

export type MembersState = { ok: boolean; error?: string; inviteUrl?: string };

export async function inviteMemberAction(
  workspaceId: string,
  email: string,
  role: "admin" | "editor" | "viewer",
): Promise<MembersState> {
  const parsed = inviteSchema.safeParse({
    workspaceId,
    email,
    role,
    isOwnershipClaim: false,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const actorRole = await getMemberRole(workspaceId);
  if (!canManage(actorRole)) return { ok: false, error: "Permission denied." };

  const token = randomBytes(24).toString("base64url");
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("invitations").insert({
    workspace_id: workspaceId,
    email: parsed.data.email,
    role: parsed.data.role,
    token,
    expires_at: expires,
    invited_by: user?.id ?? null,
  });
  if (error) return { ok: false, error: "Could not create the invitation." };

  await supabase.from("audit_logs").insert({
    workspace_id: workspaceId,
    actor_id: user?.id ?? null,
    action: "invitation.created",
    target_type: "invitation",
    meta: { email: parsed.data.email, role: parsed.data.role },
  });

  revalidatePath("/settings/members");
  return { ok: true, inviteUrl: `${siteUrl}/invite/${token}` };
}

export async function updateMemberRoleAction(
  workspaceId: string,
  memberId: string,
  role: "admin" | "editor" | "viewer",
): Promise<MembersState> {
  const actorRole = await getMemberRole(workspaceId);
  if (!canManage(actorRole)) return { ok: false, error: "Permission denied." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId)
    .eq("workspace_id", workspaceId)
    .neq("role", "owner");
  if (error) return { ok: false, error: "Could not update the member." };

  revalidatePath("/settings/members");
  return { ok: true };
}

export async function removeMemberAction(
  workspaceId: string,
  memberId: string,
): Promise<MembersState> {
  const actorRole = await getMemberRole(workspaceId);
  if (!canManage(actorRole)) return { ok: false, error: "Permission denied." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", workspaceId)
    .neq("role", "owner");
  if (error) return { ok: false, error: "Could not remove the member." };

  revalidatePath("/settings/members");
  return { ok: true };
}
