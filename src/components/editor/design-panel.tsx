"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import type { ThemeRow } from "@/types/database";
import type { PageDesign, ThemeConfig } from "@/lib/design/theme";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  themes: ThemeRow[];
  design: PageDesign;
  onApply: (design: PageDesign) => Promise<void>;
  saving?: boolean;
}

export function DesignPanel({ open, onClose, themes, design, onApply, saving }: Props) {
  const [tab, setTab] = useState<"themes" | "custom">("themes");
  const [draft, setDraft] = useState<PageDesign>(design);

  function set<K extends keyof PageDesign>(key: K, value: PageDesign[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Page design"
      description="Pick a theme or fine-tune colors. Applying a theme keeps your content."
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" onClick={() => onApply(draft)} loading={saving}>
            Apply design
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex gap-1 rounded-lg bg-workspace p-1">
        {(["themes", "custom"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-surface text-ink shadow-sm" : "text-ink-secondary",
            )}
          >
            {t === "themes" ? "Theme gallery" : "Custom"}
          </button>
        ))}
      </div>

      {tab === "themes" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {themes.map((theme) => {
            const cfg = theme.config as unknown as ThemeConfig;
            const selected = draft.themeKey === theme.key;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => set("themeKey", theme.key)}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition-all",
                  selected
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-line hover:border-accent/60",
                )}
              >
                <div
                  className="flex flex-col gap-1.5 p-3"
                  style={{ background: cfg.background }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: cfg.heading }}
                  >
                    Aa Heading
                  </span>
                  <span className="text-xs" style={{ color: cfg.text }}>
                    Sample text line
                  </span>
                  <span
                    className="mt-1 rounded px-2 py-1 text-center text-xs font-medium"
                    style={{
                      background: cfg.button_bg,
                      color: cfg.button_text,
                      borderRadius: cfg.button_radius,
                    }}
                  >
                    Button
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-line bg-surface px-2.5 py-1.5">
                  <span className="truncate text-xs font-medium text-ink">
                    {theme.name}
                  </span>
                  {selected ? <Check className="size-3.5 text-accent" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Background color" htmlFor="bg">
            <Input
              id="bg"
              value={draft.background ?? ""}
              placeholder="#FFFFFF"
              onChange={(e) => set("background", e.target.value || undefined)}
            />
          </Field>
          <Field label="Main text color" htmlFor="text">
            <Input
              id="text"
              value={draft.textColor ?? ""}
              placeholder="#30343A"
              onChange={(e) => set("textColor", e.target.value || undefined)}
            />
          </Field>
          <Field label="Button background" htmlFor="btn">
            <Input
              id="btn"
              value={draft.buttonBg ?? ""}
              placeholder="#171717"
              onChange={(e) => set("buttonBg", e.target.value || undefined)}
            />
          </Field>
          <Field label="Button radius (px)" htmlFor="radius">
            <Input
              id="radius"
              type="number"
              value={draft.buttonRadius ?? ""}
              onChange={(e) =>
                set("buttonRadius", e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Field>
          <Field label="Header alignment" htmlFor="align">
            <Select
              id="align"
              value={draft.headerAlign ?? "center"}
              onChange={(e) => set("headerAlign", e.target.value as PageDesign["headerAlign"])}
            >
              <option value="center">Center</option>
              <option value="left">Left</option>
            </Select>
          </Field>
        </div>
      )}
    </Dialog>
  );
}
