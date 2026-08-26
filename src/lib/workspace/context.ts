import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  ProfileRow,
  WorkspaceRole,
  WorkspaceRow,
} from "@/types/database";

export interface CurrentUser {
  id: string;
  email: string;
  profile: ProfileRow | null;
}

export interface MembershipWorkspace {
  workspace: WorkspaceRow;
  role: WorkspaceRole;
}

/** Returns the signed-in user, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { id: user.id, email: user.email ?? "", profile };
});

/** Requires an authenticated user; redirects to login otherwise. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** All workspaces the current user belongs to, with their role. */
export const getUserWorkspaces = cache(
  async (): Promise<MembershipWorkspace[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_members")
      .select("role, workspace:workspaces(*)")
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    return data
      .filter((row) => row.workspace)
      .map((row) => ({
        role: row.role as WorkspaceRole,
        workspace: row.workspace as unknown as WorkspaceRow,
      }));
  },
);

/**
 * Resolves the active workspace for a request. Falls back to the first
 * workspace. Redirects to onboarding when the user has none.
 */
export async function getActiveWorkspace(
  preferredId?: string,
): Promise<MembershipWorkspace> {
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) redirect("/onboarding");

  if (preferredId) {
    const match = workspaces.find((w) => w.workspace.id === preferredId);
    if (match) return match;
  }
  return workspaces[0];
}

/** Role of the current user within a specific workspace, or null. */
export async function getMemberRole(
  workspaceId: string,
): Promise<WorkspaceRole | null> {
  const workspaces = await getUserWorkspaces();
  return (
    workspaces.find((w) => w.workspace.id === workspaceId)?.role ?? null
  );
}
