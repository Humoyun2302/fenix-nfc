"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ScanLine,
  Copy,
  QrCode,
  MoreHorizontal,
  Power,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import { useToast } from "@/components/ui/toast";
import { QrModal } from "@/components/qr/qr-modal";
import { canManage } from "@/lib/permissions/roles";
import type { NfcTagRow, PageRow, WorkspaceRole } from "@/types/database";
import {
  createNfcTagAction,
  assignNfcTagAction,
  toggleNfcTagAction,
  deleteNfcTagAction,
} from "./actions";

type MiniPage = Pick<PageRow, "id" | "title" | "slug" | "status">;

interface Props {
  workspaceId: string;
  role: WorkspaceRole;
  tags: NfcTagRow[];
  pages: MiniPage[];
  siteUrl: string;
}

export function NfcClient({ workspaceId, role, tags, pages, siteUrl }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const manager = canManage(role);

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);

  function managedUrl(code: string) {
    return `${siteUrl}/t/${code}`;
  }

  function handleCreate() {
    startTransition(async () => {
      const res = await createNfcTagAction(workspaceId, name);
      if (res.ok) {
        toast.success("NFC tag created");
        setCreateOpen(false);
        setName("");
        router.refresh();
      } else {
        toast.error("Couldn't create tag", res.error);
      }
    });
  }

  function handleAssign(tagId: string, pageId: string) {
    startTransition(async () => {
      const res = await assignNfcTagAction(workspaceId, tagId, pageId || null);
      if (res.ok) {
        toast.success("Tag assigned");
        router.refresh();
      } else {
        toast.error("Couldn't assign", res.error);
      }
    });
  }

  function handleToggle(tagId: string, active: boolean) {
    startTransition(async () => {
      const res = await toggleNfcTagAction(workspaceId, tagId, active);
      if (res.ok) {
        toast.success(active ? "Tag reactivated" : "Tag disabled");
        router.refresh();
      } else {
        toast.error("Couldn't update", res.error);
      }
    });
  }

  function handleDelete(tagId: string) {
    if (!confirm("Delete this NFC tag? Scan history will be removed.")) return;
    startTransition(async () => {
      const res = await deleteNfcTagAction(workspaceId, tagId);
      if (res.ok) {
        toast.success("Tag deleted");
        router.refresh();
      } else {
        toast.error("Couldn't delete", res.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">NFC tags</h1>
          <p className="text-sm text-ink-secondary">
            Managed tags redirect to whichever page you assign — reassign anytime.
          </p>
        </div>
        {manager ? (
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New tag
          </Button>
        ) : null}
      </div>

      {tags.length === 0 ? (
        <EmptyState
          icon={ScanLine}
          title="No NFC tags yet"
          description="Create a managed tag, print its code, and point it at any page."
          action={manager ? { label: "Create tag", onClick: () => setCreateOpen(true) } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{tag.name}</p>
                    <span
                      className={
                        tag.status === "active"
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                          : "rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger"
                      }
                    >
                      {tag.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(managedUrl(tag.code));
                      toast.success("Managed URL copied");
                    }}
                    className="mt-1 flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
                  >
                    <Copy className="size-3.5" /> /t/{tag.code}
                  </button>
                  <p className="mt-1 text-xs text-ink-secondary">
                    {tag.total_scans} scans · {tag.unique_scans} unique
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {manager ? (
                    <Select
                      value={tag.target_page_id ?? ""}
                      onChange={(e) => handleAssign(tag.id, e.target.value)}
                      disabled={pending}
                      className="h-9 w-44 text-sm"
                      aria-label="Assign page"
                    >
                      <option value="">Unassigned</option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </Select>
                  ) : null}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQrValue(managedUrl(tag.code))}
                    aria-label="Generate QR"
                  >
                    <QrCode className="size-4" />
                  </Button>
                  {manager ? (
                    <Menu
                      trigger={
                        <span className="flex size-9 items-center justify-center rounded-[var(--radius-control)] border border-line text-ink-secondary hover:text-ink">
                          <MoreHorizontal className="size-4" />
                        </span>
                      }
                    >
                      <MenuItem onClick={() => handleToggle(tag.id, tag.status !== "active")}>
                        <Power className="size-4" />
                        {tag.status === "active" ? "Disable" : "Reactivate"}
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem destructive onClick={() => handleDelete(tag.id)}>
                        <Trash2 className="size-4" /> Delete
                      </MenuItem>
                    </Menu>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create NFC tag"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleCreate} loading={pending}>
              Create tag
            </Button>
          </div>
        }
      >
        <Field label="Tag name" htmlFor="tag-name" hint="A generated code will be assigned automatically.">
          <Input
            id="tag-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Front desk tag"
            autoFocus
          />
        </Field>
      </Dialog>

      <QrModal
        open={!!qrValue}
        onClose={() => setQrValue(null)}
        value={qrValue ?? ""}
        title="NFC tag QR code"
      />
    </div>
  );
}
