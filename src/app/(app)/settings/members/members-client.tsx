"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { canManage, ROLE_LABELS } from "@/lib/permissions/roles";
import type { WorkspaceRole } from "@/types/database";
import {
  inviteMemberAction,
  updateMemberRoleAction,
  removeMemberAction,
} from "./actions";

export interface MemberView {
  id: string;
  role: WorkspaceRole;
  fullName: string | null;
  email: string;
}

export function MembersClient({
  workspaceId,
  role,
  members,
}: {
  workspaceId: string;
  role: WorkspaceRole;
  members: MemberView[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const manager = canManage(role);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  function handleInvite() {
    startTransition(async () => {
      const res = await inviteMemberAction(workspaceId, email, inviteRole);
      if (res.ok && res.inviteUrl) {
        setInviteUrl(res.inviteUrl);
        setEmail("");
        toast.success("Invitation created");
        router.refresh();
      } else {
        toast.error("Couldn't invite", res.error);
      }
    });
  }

  function handleRole(memberId: string, newRole: "admin" | "editor" | "viewer") {
    startTransition(async () => {
      const res = await updateMemberRoleAction(workspaceId, memberId, newRole);
      if (res.ok) {
        toast.success("Role updated");
        router.refresh();
      } else {
        toast.error("Couldn't update role", res.error);
      }
    });
  }

  function handleRemove(memberId: string) {
    if (!confirm("Remove this member from the workspace?")) return;
    startTransition(async () => {
      const res = await removeMemberAction(workspaceId, memberId);
      if (res.ok) {
        toast.success("Member removed");
        router.refresh();
      } else {
        toast.error("Couldn't remove", res.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Team members</h1>
          <p className="text-sm text-ink-secondary">
            Invite teammates and manage their roles.
          </p>
        </div>
        {manager ? (
          <Button variant="accent" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" /> Invite
          </Button>
        ) : null}
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-dark-surface text-xs font-semibold text-white">
              {(m.fullName ?? m.email).slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {m.fullName ?? m.email}
              </p>
              <p className="truncate text-xs text-ink-secondary">{m.email}</p>
            </div>
            {manager && m.role !== "owner" ? (
              <Select
                value={m.role}
                onChange={(e) =>
                  handleRole(m.id, e.target.value as "admin" | "editor" | "viewer")
                }
                disabled={pending}
                className="h-9 w-36 text-sm"
                aria-label="Member role"
              >
                <option value="admin">Administrator</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Select>
            ) : (
              <span className="rounded-full bg-workspace px-2.5 py-1 text-xs font-medium text-ink-secondary">
                {ROLE_LABELS[m.role]}
              </span>
            )}
            {manager && m.role !== "owner" ? (
              <button
                type="button"
                onClick={() => handleRemove(m.id)}
                aria-label="Remove member"
                className="rounded-md p-1.5 text-ink-secondary hover:bg-workspace hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <Dialog
        open={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          setInviteUrl(null);
        }}
        title="Invite a team member"
        size="sm"
        footer={
          inviteUrl ? (
            <Button variant="accent" className="w-full" onClick={() => { setInviteOpen(false); setInviteUrl(null); }}>
              Done
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleInvite} loading={pending}>
                Create invitation
              </Button>
            </div>
          )
        }
      >
        {inviteUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-ink-secondary">
              Share this secure invitation link. It expires in 7 days.
            </p>
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly />
              <Button
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(inviteUrl);
                  toast.success("Link copied");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Email" htmlFor="invite-email">
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@example.com"
                autoFocus
              />
            </Field>
            <Field label="Role" htmlFor="invite-role">
              <Select
                id="invite-role"
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value as "admin" | "editor" | "viewer")
                }
              >
                <option value="admin">Administrator</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Select>
            </Field>
          </div>
        )}
      </Dialog>
    </div>
  );
}
