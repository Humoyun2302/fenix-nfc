"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Pencil,
  Files,
  Archive,
  Trash2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import { useToast } from "@/components/ui/toast";
import { canEdit, canManage } from "@/lib/permissions/roles";
import type { PageRow, WorkspaceRole } from "@/types/database";
import {
  createPageAction,
  duplicatePageAction,
  archivePageAction,
  deletePageAction,
} from "./actions";

interface Props {
  workspaceId: string;
  role: WorkspaceRole;
  pages: PageRow[];
  siteUrl: string;
}

export function DashboardClient({ workspaceId, role, pages, siteUrl }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const editable = canEdit(role);
  const manager = canManage(role);

  function handleCreate() {
    if (!title.trim()) return;
    startTransition(async () => {
      const res = await createPageAction(workspaceId, title.trim());
      if (!res.ok) toast.error("Couldn't create page", res.error);
      // On success the action redirects to the editor.
    });
  }

  function copyUrl(slug: string) {
    void navigator.clipboard.writeText(`${siteUrl}/p/${slug}`);
    toast.success("Link copied");
  }

  function handleDuplicate(pageId: string) {
    startTransition(async () => {
      const res = await duplicatePageAction(pageId, workspaceId);
      if (res.ok) {
        toast.success("Page duplicated");
        router.refresh();
      } else {
        toast.error("Couldn't duplicate", res.error);
      }
    });
  }

  function handleArchive(pageId: string) {
    startTransition(async () => {
      const res = await archivePageAction(pageId, workspaceId, true);
      if (res.ok) {
        toast.success("Page archived");
        router.refresh();
      } else {
        toast.error("Couldn't archive", res.error);
      }
    });
  }

  function handleDelete(pageId: string) {
    if (!confirm("Delete this page permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deletePageAction(pageId, workspaceId);
      if (res.ok) {
        toast.success("Page deleted");
        router.refresh();
      } else {
        toast.error("Couldn't delete", res.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Pages</h1>
          <p className="text-sm text-ink-secondary">
            Create and manage your mini-sites and NFC pages.
          </p>
        </div>
        {editable ? (
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New page
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        {pages.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No pages yet"
            description="Create your first page to start adding blocks and publishing."
            action={
              editable ? { label: "Create page", onClick: () => setCreateOpen(true) } : undefined
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/editor/${page.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate font-medium text-ink">{page.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-secondary">
                      <Globe className="size-3" /> /p/{page.slug}
                    </p>
                  </Link>
                  <Menu
                    trigger={
                      <span className="rounded-md p-1.5 text-ink-secondary hover:bg-workspace hover:text-ink">
                        <MoreHorizontal className="size-4" />
                      </span>
                    }
                  >
                    <Link href={`/editor/${page.id}`}>
                      <MenuItem>
                        <Pencil className="size-4" /> Edit
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={() => copyUrl(page.slug)}>
                      <Copy className="size-4" /> Copy URL
                    </MenuItem>
                    {editable ? (
                      <MenuItem onClick={() => handleDuplicate(page.id)}>
                        <Files className="size-4" /> Duplicate
                      </MenuItem>
                    ) : null}
                    {editable ? (
                      <MenuItem onClick={() => handleArchive(page.id)}>
                        <Archive className="size-4" /> Archive
                      </MenuItem>
                    ) : null}
                    {manager ? (
                      <>
                        <MenuSeparator />
                        <MenuItem destructive onClick={() => handleDelete(page.id)}>
                          <Trash2 className="size-4" /> Delete
                        </MenuItem>
                      </>
                    ) : null}
                  </Menu>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={
                      page.status === "published"
                        ? "inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                        : "inline-flex items-center gap-1 rounded-full bg-workspace px-2 py-0.5 text-xs font-medium text-ink-secondary"
                    }
                  >
                    {page.status === "published"
                      ? page.has_unpublished_changes
                        ? "Published · changes"
                        : "Published"
                      : "Draft"}
                  </span>
                  {page.status === "published" ? (
                    <a
                      href={`${siteUrl}/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover"
                    >
                      View <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a new page"
        description="Give your page a name. You can change everything later."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleCreate} loading={pending}>
              Create page
            </Button>
          </div>
        }
      >
        <Field label="Page name" htmlFor="page-title">
          <Input
            id="page-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My business card"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </Field>
      </Dialog>
    </div>
  );
}
