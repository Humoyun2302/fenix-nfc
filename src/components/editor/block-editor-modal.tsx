"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { EDITOR_SCHEMA, type FieldSchema } from "@/lib/blocks/editor-schema";
import { getBlockDefinition } from "@/lib/blocks/registry";
import type { BlockContent, BlockDesign, EditorBlock } from "@/lib/blocks/types";
import { cn } from "@/lib/utils";

interface Props {
  block: EditorBlock | null;
  onClose: () => void;
  onSave: (
    blockId: string,
    patch: { content: BlockContent; design: BlockDesign; is_visible: boolean },
  ) => Promise<void>;
  onDelete: (blockId: string) => void;
  saving?: boolean;
}

type Tab = "content" | "design" | "visibility";

export function BlockEditorModal({ block, onClose, onSave, onDelete, saving }: Props) {
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<BlockContent>(block?.content ?? {});
  const [design, setDesign] = useState<BlockDesign>(block?.design ?? {});
  const [visible, setVisible] = useState<boolean>(block?.is_visible ?? true);

  // Re-sync when a different block is opened.
  const [trackedId, setTrackedId] = useState<string | null>(block?.id ?? null);
  if (block && block.id !== trackedId) {
    setTrackedId(block.id);
    setContent(block.content ?? {});
    setDesign(block.design ?? {});
    setVisible(block.is_visible);
    setTab("content");
  }

  if (!block) return null;
  const def = getBlockDefinition(block.type);
  const schema = EDITOR_SCHEMA[block.type] ?? [];

  function setField(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value as never }));
  }

  async function handleSave() {
    if (!block) return;
    await onSave(block.id, { content, design, is_visible: visible });
  }

  return (
    <Dialog
      open={!!block}
      onClose={onClose}
      title={def?.name ?? "Edit block"}
      size="md"
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="text-danger"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-4 flex gap-1 rounded-lg bg-workspace p-1">
        {(["content", "design", "visibility"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-surface text-ink shadow-sm" : "text-ink-secondary",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "content" ? (
        <div className="space-y-4">
          {schema.length === 0 ? (
            <p className="text-sm text-ink-secondary">
              This block has no content options.
            </p>
          ) : (
            schema.map((field) => (
              <FieldEditor
                key={field.key}
                field={field}
                value={content[field.key]}
                onChange={(v) => setField(field.key, v)}
              />
            ))
          )}
        </div>
      ) : null}

      {tab === "design" ? (
        <DesignEditor design={design} onChange={setDesign} />
      ) : null}

      {tab === "visibility" ? (
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-line p-3">
            <div>
              <p className="text-sm font-medium text-ink">Visible on page</p>
              <p className="text-xs text-ink-secondary">
                Hidden blocks are saved but not shown to visitors.
              </p>
            </div>
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="size-5 accent-[var(--fx-accent)]"
            />
          </label>
        </div>
      ) : null}
    </Dialog>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key}`;

  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    return (
      <Field label={field.label} hint={field.hint}>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">
                  Item {index + 1}
                </span>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  className="rounded p-1 text-ink-secondary hover:bg-workspace hover:text-danger"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-2">
                {(field.item ?? []).map((sub) => (
                  <FieldEditor
                    key={sub.key}
                    field={sub}
                    value={item[sub.key]}
                    onChange={(v) => {
                      const next = [...items];
                      next[index] = { ...next[index], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange([...items, { ...(field.itemDefaults ?? {}) }])
            }
          >
            <Plus className="size-4" /> Add item
          </Button>
        </div>
      </Field>
    );
  }

  const stringValue = value == null ? "" : String(value);

  return (
    <Field label={field.label} htmlFor={id} hint={field.hint}>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <Select
          id={id}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : field.type === "number" ? (
        <Input
          id={id}
          type="number"
          value={stringValue}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : field.type === "datetime" ? (
        <Input
          id={id}
          type="datetime-local"
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          type={field.type === "url" ? "url" : "text"}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

function DesignEditor({
  design,
  onChange,
}: {
  design: BlockDesign;
  onChange: (d: BlockDesign) => void;
}) {
  function set<K extends keyof BlockDesign>(key: K, value: BlockDesign[K]) {
    onChange({ ...design, [key]: value });
  }
  return (
    <div className="space-y-4">
      <Field label="Alignment" htmlFor="d-align">
        <Select
          id="d-align"
          value={design.align ?? "center"}
          onChange={(e) => set("align", e.target.value as BlockDesign["align"])}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </Select>
      </Field>
      <Field label="Background color" htmlFor="d-bg" hint="Leave blank to use the theme.">
        <Input
          id="d-bg"
          value={design.background ?? ""}
          placeholder="#FFFFFF"
          onChange={(e) => set("background", e.target.value || undefined)}
        />
      </Field>
      <Field label="Text color" htmlFor="d-text">
        <Input
          id="d-text"
          value={design.textColor ?? ""}
          placeholder="#30343A"
          onChange={(e) => set("textColor", e.target.value || undefined)}
        />
      </Field>
      <Button variant="outline" size="sm" onClick={() => onChange({})}>
        Reset to global style
      </Button>
    </div>
  );
}
