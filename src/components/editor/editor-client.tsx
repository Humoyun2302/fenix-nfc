"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Eye,
  Palette,
  Copy,
  Check,
  ChevronLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { PageRow, ThemeRow, WorkspaceRole } from "@/types/database";
import type { BlockContent, BlockDesign, BlockType, EditorBlock } from "@/lib/blocks/types";
import type { PageDesign } from "@/lib/design/theme";
import { resolveDesign } from "@/lib/design/theme";
import { canEdit } from "@/lib/permissions/roles";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { SortableBlock } from "./sortable-block";
import { AddBlockModal } from "./add-block-modal";
import { BlockEditorModal } from "./block-editor-modal";
import { DesignPanel } from "./design-panel";
import {
  addBlockAction,
  updateBlockAction,
  reorderBlocksAction,
  duplicateBlockAction,
  deleteBlockAction,
  updatePageDesignAction,
  publishPageAction,
} from "@/app/(app)/editor/actions";
import { LayoutGrid } from "lucide-react";

interface Props {
  page: PageRow;
  role: WorkspaceRole;
  initialBlocks: EditorBlock[];
  themes: ThemeRow[];
  siteUrl: string;
}

export function EditorClient({ page, role, initialBlocks, themes, siteUrl }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [, startTransition] = useTransition();

  const editable = canEdit(role);
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [design, setDesign] = useState<PageDesign>((page.design as PageDesign) ?? {});
  const [dirty, setDirty] = useState(page.has_unpublished_changes);
  const [published, setPublished] = useState(page.status === "published");

  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingBlock, setSavingBlock] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [savingDesign, setSavingDesign] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const themeConfig = useMemo(() => {
    const key = design.themeKey ?? "minimal-light";
    return themes.find((t) => t.key === key)?.config ?? null;
  }, [design.themeKey, themes]);

  const resolved = useMemo(
    () => resolveDesign(themeConfig, design),
    [themeConfig, design],
  );

  const publicUrl = `${siteUrl}/p/${page.slug}`;
  const editingBlock = blocks.find((b) => b.id === editingId) ?? null;

  function markDirty() {
    setDirty(true);
  }

  async function handleAdd(type: BlockType) {
    setAdding(true);
    const res = await addBlockAction(page.workspace_id, page.id, type);
    setAdding(false);
    if (!res.ok || !res.data) {
      toast.error("Couldn't add block", res.error);
      return;
    }
    setAddOpen(false);
    markDirty();
    router.refresh();
    // Open the editor for the new block once the refresh brings it in.
    setEditingId(res.data.id);
  }

  async function handleSaveBlock(
    blockId: string,
    patch: { content: BlockContent; design: BlockDesign; is_visible: boolean },
  ) {
    setSavingBlock(true);
    const prev = blocks;
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === blockId
          ? { ...b, content: patch.content, design: patch.design, is_visible: patch.is_visible }
          : b,
      ),
    );
    const res = await updateBlockAction(page.workspace_id, page.id, blockId, patch);
    setSavingBlock(false);
    if (!res.ok) {
      setBlocks(prev); // rollback
      toast.error("Couldn't save block", res.error);
      return;
    }
    markDirty();
    setEditingId(null);
    toast.success("Block saved");
  }

  function handleDelete(blockId: string) {
    const prev = blocks;
    setBlocks((bs) => bs.filter((b) => b.id !== blockId));
    setEditingId(null);
    startTransition(async () => {
      const res = await deleteBlockAction(page.workspace_id, page.id, blockId);
      if (!res.ok) {
        setBlocks(prev);
        toast.error("Couldn't delete block", res.error);
      } else {
        markDirty();
      }
    });
  }

  function handleDuplicate(blockId: string) {
    startTransition(async () => {
      const res = await duplicateBlockAction(page.workspace_id, page.id, blockId);
      if (res.ok) {
        markDirty();
        router.refresh();
      } else {
        toast.error("Couldn't duplicate", res.error);
      }
    });
  }

  function handleToggleVisible(blockId: string) {
    const target = blocks.find((b) => b.id === blockId);
    if (!target) return;
    const nextVisible = !target.is_visible;
    setBlocks((bs) =>
      bs.map((b) => (b.id === blockId ? { ...b, is_visible: nextVisible } : b)),
    );
    startTransition(async () => {
      const res = await updateBlockAction(page.workspace_id, page.id, blockId, {
        is_visible: nextVisible,
      });
      if (!res.ok) {
        setBlocks((bs) =>
          bs.map((b) => (b.id === blockId ? { ...b, is_visible: !nextVisible } : b)),
        );
        toast.error("Couldn't update block", res.error);
      } else {
        markDirty();
      }
    });
  }

  function persistOrder(next: EditorBlock[]) {
    const prev = blocks;
    setBlocks(next.map((b, i) => ({ ...b, position: i })));
    startTransition(async () => {
      const res = await reorderBlocksAction(
        page.workspace_id,
        page.id,
        next.map((b) => b.id),
      );
      if (!res.ok) {
        setBlocks(prev);
        toast.error("Couldn't reorder", res.error);
      } else {
        markDirty();
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    persistOrder(arrayMove(blocks, oldIndex, newIndex));
  }

  function move(blockId: string, dir: -1 | 1) {
    const index = blocks.findIndex((b) => b.id === blockId);
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    persistOrder(arrayMove(blocks, index, target));
  }

  async function handleApplyDesign(next: PageDesign) {
    setSavingDesign(true);
    const res = await updatePageDesignAction(page.workspace_id, page.id, next);
    setSavingDesign(false);
    if (!res.ok) {
      toast.error("Couldn't apply design", res.error);
      return;
    }
    setDesign(next);
    setDesignOpen(false);
    markDirty();
    toast.success("Design applied");
  }

  async function handlePublish() {
    setPublishing(true);
    const res = await publishPageAction(page.workspace_id, page.id);
    setPublishing(false);
    if (!res.ok) {
      toast.error("Couldn't publish", res.error);
      return;
    }
    setDirty(false);
    setPublished(true);
    toast.success("Published", "Your public page is now live.");
    router.refresh();
  }

  function copyUrl() {
    void navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col">
      {/* Page context bar */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-2.5">
          <Link
            href="/dashboard"
            className="rounded-md p-1.5 text-ink-secondary hover:bg-workspace hover:text-ink"
            aria-label="Back to pages"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <span className="max-w-40 truncate text-sm font-medium text-ink">
            {page.title}
          </span>
          <span
            className={
              dirty
                ? "rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning"
                : published
                  ? "rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                  : "rounded-full bg-workspace px-2 py-0.5 text-xs font-medium text-ink-secondary"
            }
          >
            {dirty ? "Unpublished changes" : published ? "Published" : "Draft"}
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={copyUrl}
              className="hidden items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-ink-secondary hover:text-ink sm:inline-flex"
            >
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              <span className="max-w-40 truncate">/p/{page.slug}</span>
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-ink-secondary hover:bg-workspace hover:text-ink"
              aria-label="Open public page"
            >
              <ExternalLink className="size-4" />
            </a>
            {editable ? (
              <Button
                variant="accent"
                size="sm"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? <Loader2 className="size-4 animate-spin" /> : null}
                Publish
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Editing workspace */}
      <div className="flex-1 bg-workspace px-4 pb-32 pt-6">
        <div
          className="mx-auto overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={{ width: "min(390px, 100%)" }}
        >
          <div
            className="fx-scroll max-h-[calc(100dvh-220px)] overflow-y-auto"
            style={{ ...resolved.backgroundStyle, ...(resolved.vars as CSSProperties) }}
          >
            <div
              className="mx-auto flex flex-col px-4 py-6"
              style={{
                maxWidth: resolved.contentWidth,
                gap: "var(--block-gap)",
                color: "var(--page-text)",
              }}
            >
              {sorted.length === 0 ? (
                <div className="py-10">
                  <EmptyState
                    icon={LayoutGrid}
                    title="Your page is empty"
                    description="Add your first block to get started."
                    action={
                      editable
                        ? { label: "Add block", onClick: () => setAddOpen(true) }
                        : undefined
                    }
                  />
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sorted.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col" style={{ gap: "var(--block-gap)" }}>
                      {sorted.map((block, i) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isFirst={i === 0}
                          isLast={i === sorted.length - 1}
                          onEdit={() => editable && setEditingId(block.id)}
                          onDuplicate={() => handleDuplicate(block.id)}
                          onToggleVisible={() => handleToggleVisible(block.id)}
                          onDelete={() => handleDelete(block.id)}
                          onMoveUp={() => move(block.id, -1)}
                          onMoveDown={() => move(block.id, 1)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating toolbar */}
      {editable ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
          <div
            className="pointer-events-auto flex items-center justify-between gap-2 rounded-2xl bg-dark-surface p-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            style={{ width: "min(390px, 100%)" }}
          >
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Eye className="size-4" /> <span className="hidden sm:inline">Preview</span>
            </a>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              <Plus className="size-4" /> Add block
            </button>
            <button
              type="button"
              onClick={() => setDesignOpen(true)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Palette className="size-4" /> <span className="hidden sm:inline">Design</span>
            </button>
          </div>
        </div>
      ) : null}

      <AddBlockModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        adding={adding}
      />
      <BlockEditorModal
        block={editingBlock}
        onClose={() => setEditingId(null)}
        onSave={handleSaveBlock}
        onDelete={handleDelete}
        saving={savingBlock}
      />
      <DesignPanel
        open={designOpen}
        onClose={() => setDesignOpen(false)}
        themes={themes}
        design={design}
        onApply={handleApplyDesign}
        saving={savingDesign}
      />
    </div>
  );
}
