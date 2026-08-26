import type { WorkspaceRole } from "@/types/database";

/**
 * Client/server-shared permission helpers. These mirror the SQL RLS helpers
 * (fx_can_manage / fx_can_edit / fx_is_owner) so the UI can hide actions the
 * backend would reject. The database remains the source of truth.
 */

const RANK: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  editor: 1,
  viewer: 0,
};

export function isOwner(role: WorkspaceRole | null | undefined): boolean {
  return role === "owner";
}

export function canManage(role: WorkspaceRole | null | undefined): boolean {
  return !!role && RANK[role] >= RANK.admin;
}

export function canEdit(role: WorkspaceRole | null | undefined): boolean {
  return !!role && RANK[role] >= RANK.editor;
}

export function canView(role: WorkspaceRole | null | undefined): boolean {
  return !!role;
}

export type Permission =
  | "billing.manage"
  | "members.manage"
  | "workspace.delete"
  | "pages.edit"
  | "pages.publish"
  | "media.upload"
  | "nfc.manage"
  | "forms.manage"
  | "analytics.view"
  | "integrations.manage"
  | "leads.view";

export function can(
  role: WorkspaceRole | null | undefined,
  permission: Permission,
): boolean {
  switch (permission) {
    case "billing.manage":
    case "workspace.delete":
      return isOwner(role);
    case "members.manage":
    case "nfc.manage":
    case "integrations.manage":
      return canManage(role);
    case "forms.manage":
    case "pages.edit":
    case "pages.publish":
    case "media.upload":
      return canEdit(role);
    case "analytics.view":
    case "leads.view":
      return canView(role);
    default:
      return false;
  }
}

export const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
};
