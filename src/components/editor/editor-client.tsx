"use client";

import { useMemo, useState, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Copy, Eye, GripVertical, Palette, Plus, Save, Settings, Trash2 } from "lucide-react";
import type { BlockType, EditorBlock, PageDesign, PageRecord } from "@/types/product";
import { blockCatalog, themePresets } from "@/lib/product-data";
import { formatPublicUrl } from "@/lib/utils";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  addBlockAction,
  applyThemeAction,
  publishPageAction,
  reorderBlocksAction,
  updateBlockAction,
  updateDesignAction,
} from "@/app/editor/[pageId]/actions";

function SortableBlock({
  block,
  design,
  onEdit,
}: {
  block: EditorBlock;
  design: PageDesign;
  onEdit: (block: EditorBlock) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-70" : ""}
    >
      <div className="group relative">
        <button
          className="absolute -left-9 top-3 hidden rounded-md border border-border bg-white p-1 text-muted shadow-sm group-hover:block"
          aria-label="Drag block"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <BlockRenderer block={block} design={design} editable onClick={() => onEdit(block)} />
      </div>
    </div>
  );
}

export function EditorClient({
  page,
  blocks: initialBlocks,
}: {
  page: PageRecord;
  blocks: EditorBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [design, setDesign] = useState<PageDesign>(page.draft_design);
  const [modal, setModal] = useState<"add" | "theme" | "design" | null>(null);
  const [editing, setEditing] = useState<EditorBlock | null>(null);
  const [contentDraft, setContentDraft] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filteredBlocks = useMemo(
    () =>
      blockCatalog.filter((block) =>
        `${block.name} ${block.category} ${block.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    const previous = blocks;
    const ordered = arrayMove(blocks, oldIndex, newIndex).map((block, position) => ({ ...block, position }));
    setBlocks(ordered);
    startTransition(async () => {
      try {
        await reorderBlocksAction({ pageId: page.id, orderedIds: ordered.map((block) => block.id) });
      } catch (caught) {
        setBlocks(previous);
        setError(caught instanceof Error ? caught.message : "Order could not be saved.");
      }
    });
  }

  function addBlock(type: BlockType) {
    startTransition(async () => {
      setError(null);
      await addBlockAction({ pageId: page.id, type });
      window.location.reload();
    });
  }

  function openEdit(block: EditorBlock) {
    setEditing(block);
    setContentDraft(JSON.stringify(block.content, null, 2));
  }

  function saveBlock() {
    if (!editing) return;
    startTransition(async () => {
      try {
        const content = JSON.parse(contentDraft) as Record<string, unknown>;
        await updateBlockAction({ blockId: editing.id, content, design: editing.design, isVisible: editing.is_visible });
        setBlocks((current) => current.map((block) => (block.id === editing.id ? { ...block, content } : block)));
        setEditing(null);
        setMessage("Block saved.");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Block could not be saved.");
      }
    });
  }

  function hideBlock() {
    if (!editing) return;
    startTransition(async () => {
      await updateBlockAction({
        blockId: editing.id,
        content: editing.content,
        design: editing.design,
        isVisible: !editing.is_visible,
      });
      setBlocks((current) =>
        current.map((block) => (block.id === editing.id ? { ...block, is_visible: !editing.is_visible } : block)),
      );
      setEditing(null);
    });
  }

  function applyTheme(themeId: string) {
    const theme = themePresets.find((item) => item.id === themeId);
    if (!theme) return;
    setDesign(theme.design);
    startTransition(async () => {
      await applyThemeAction(page.id, themeId);
      setModal(null);
      setMessage("Theme applied.");
    });
  }

  function saveDesign() {
    startTransition(async () => {
      await updateDesignAction(page.id, design);
      setModal(null);
      setMessage("Design saved.");
    });
  }

  function publish() {
    startTransition(async () => {
      setError(null);
      await publishPageAction(page.id);
      setMessage("Page published.");
    });
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background pb-10">
      <section className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold">{page.title}</h1>
              <Badge>{page.status === "published" ? "Published" : "Unpublished changes"}</Badge>
            </div>
            <p className="mt-1 truncate text-xs text-muted">{formatPublicUrl(page.slug)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(formatPublicUrl(page.slug))}>
              <Copy className="h-4 w-4" /> Copy URL
            </Button>
            <Button variant="secondary" onClick={() => window.open(formatPublicUrl(page.slug), "_blank")}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button disabled={pending} onClick={publish}>
              <Check className="h-4 w-4" /> Publish
            </Button>
          </div>
        </div>
      </section>

      {message ? <p className="mx-auto mt-3 max-w-sm rounded-md bg-green-50 p-2 text-center text-sm text-success">{message}</p> : null}
      {error ? <p className="mx-auto mt-3 max-w-sm rounded-md bg-red-50 p-2 text-center text-sm text-error">{error}</p> : null}

      <section className="mx-auto mt-6 flex max-w-5xl justify-center px-4">
        <div className="w-full max-w-[390px]">
          <div
            className="max-h-[calc(100vh-220px)] min-h-[560px] overflow-y-auto border border-border shadow-sm"
            style={{
              background: design.backgroundColor,
              color: design.textColor,
              padding: design.pagePadding,
              borderRadius: 20,
            }}
          >
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3" style={{ gap: design.blockSpacing }}>
                  {blocks.length ? (
                    blocks.map((block) => (
                      <SortableBlock block={block} design={design} key={block.id} onEdit={openEdit} />
                    ))
                  ) : (
                    <button
                      className="flex min-h-44 w-full items-center justify-center rounded-lg border border-dashed border-border bg-white/70 text-sm text-muted"
                      onClick={() => setModal("add")}
                    >
                      Add your first block
                    </button>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          <div className="mt-4 flex h-14 items-center justify-between rounded-xl bg-dark-surface px-3 shadow-lg">
            <Button className="text-white hover:bg-white/10" variant="ghost" onClick={() => window.open(formatPublicUrl(page.slug), "_blank")}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button className="min-w-36" disabled={pending} onClick={() => setModal("add")}>
              <Plus className="h-4 w-4" /> Add Block
            </Button>
            <Button className="text-white hover:bg-white/10" variant="ghost" onClick={() => setModal("theme")}>
              <Palette className="h-4 w-4" />
            </Button>
            <Button className="text-white hover:bg-white/10" variant="ghost" onClick={() => setModal("design")}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {modal === "add" ? (
        <div className="fixed inset-0 z-40 flex items-end bg-black/40 p-0 sm:items-center sm:justify-center sm:p-4">
          <section className="max-h-[88vh] w-full overflow-y-auto rounded-t-lg bg-white p-4 shadow-lg sm:max-w-3xl sm:rounded-lg">
            <div className="sticky top-0 z-10 bg-white pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add block</h2>
                <Button variant="ghost" onClick={() => setModal(null)}>Close</Button>
              </div>
              <Input placeholder="Search blocks" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredBlocks.map((block) => (
                <button
                  className="rounded-md border border-border p-3 text-left hover:border-accent hover:bg-amber-50"
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{block.name}</p>
                    {block.premium ? <Badge>Pro</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs text-muted">{block.description}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {modal === "theme" ? (
        <div className="fixed inset-0 z-40 flex items-end bg-black/40 p-0 sm:items-center sm:justify-center sm:p-4">
          <section className="max-h-[88vh] w-full overflow-y-auto rounded-t-lg bg-white p-4 shadow-lg sm:max-w-5xl sm:rounded-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Theme gallery</h2>
              <Button variant="ghost" onClick={() => setModal(null)}>Close</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {themePresets.map((theme) => (
                <button
                  className="rounded-md border border-border p-3 text-left hover:border-accent"
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                >
                  <div className="space-y-2 rounded-md p-3" style={{ background: theme.design.backgroundColor }}>
                    <p className="font-semibold" style={{ color: theme.design.headingColor }}>{theme.name}</p>
                    <p className="text-xs" style={{ color: theme.design.textColor }}>Example text</p>
                    <span
                      className="inline-flex rounded px-3 py-1 text-xs font-semibold"
                      style={{ background: theme.design.buttonBackground, color: theme.design.buttonText }}
                    >
                      Button
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {modal === "design" ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <section className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Page design</h2>
              <Button variant="ghost" onClick={() => setModal(null)}>Close</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                ["Background", "backgroundColor"],
                ["Text", "textColor"],
                ["Heading", "headingColor"],
                ["Button", "buttonBackground"],
              ] as const).map(([label, key]) => (
                <label className="text-sm font-medium" key={key}>
                  {label}
                  <Input
                    className="mt-1"
                    type="color"
                    value={String(design[key])}
                    onChange={(event) => setDesign((current) => ({ ...current, [key]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={saveDesign}>
              <Save className="h-4 w-4" /> Save design
            </Button>
          </section>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section className="w-full max-w-xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit {editing.type.replaceAll("_", " ")}</h2>
              <Button variant="ghost" onClick={() => setEditing(null)}>Close</Button>
            </div>
            <div className="mb-3 flex gap-2 border-b border-border text-sm">
              {["Content", "Design", "Visibility", "Analytics"].map((tab) => (
                <span className="border-b-2 border-transparent px-2 py-2 first:border-accent first:font-semibold" key={tab}>
                  {tab}
                </span>
              ))}
            </div>
            <Textarea value={contentDraft} onChange={(event) => setContentDraft(event.target.value)} />
            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <Button variant="danger" onClick={hideBlock}>
                <Trash2 className="h-4 w-4" /> {editing.is_visible ? "Hide" : "Show"}
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                <Button disabled={pending} onClick={saveBlock}>Save</Button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
