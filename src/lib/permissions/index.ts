import type { WorkspaceRole } from "@/types/product";

const roleRank: Record<WorkspaceRole, number> = {
  viewer: 1,
  editor: 2,
  administrator: 3,
  owner: 4,
};

export function can(role: WorkspaceRole | null | undefined, action: string) {
  if (!role) return false;
  const rank = roleRank[role];

  if (["view_pages", "view_statistics", "view_leads"].includes(action)) return rank >= roleRank.viewer;
  if (["edit_pages", "edit_blocks", "upload_media", "publish_pages"].includes(action)) return rank >= roleRank.editor;
  if (["manage_members", "manage_nfc", "manage_forms", "manage_integrations"].includes(action)) {
    return rank >= roleRank.administrator;
  }
  if (["manage_billing", "delete_workspace", "transfer_ownership"].includes(action)) return role === "owner";
  return false;
}

export function assertCan(role: WorkspaceRole | null | undefined, action: string) {
  if (!can(role, action)) {
    throw new Error("Permission denied.");
  }
}
