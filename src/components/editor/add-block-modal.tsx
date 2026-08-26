"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { Search } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ALL_BLOCKS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "@/lib/blocks/registry";
import type { BlockCategory, BlockType } from "@/lib/blocks/types";
import { cn } from "@/lib/utils";

interface AddBlockModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: BlockType) => void;
  adding?: boolean;
}

function BlockIcon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!Cmp) return <Icons.Square className="size-5" />;
  return <Cmp className="size-5" aria-hidden />;
}

export function AddBlockModal({ open, onClose, onAdd, adding }: AddBlockModalProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlockCategory | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_BLOCKS.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add a block"
      description="Choose a block to add to your page."
      size="lg"
    >
      <div className="sticky top-0 -mx-5 -mt-4 mb-3 space-y-3 border-b border-line bg-surface px-5 pb-3 pt-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-secondary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="pl-9"
            aria-label="Search blocks"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </CategoryChip>
          {CATEGORY_ORDER.map((c) => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </CategoryChip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-secondary">
          No blocks match “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {results.map((block) => {
            const disabled = block.status !== "ready";
            return (
              <button
                key={block.type}
                type="button"
                disabled={disabled || adding}
                onClick={() => onAdd(block.type)}
                className={cn(
                  "flex flex-col items-start gap-1.5 rounded-xl border border-line bg-surface p-3 text-left transition-colors",
                  disabled
                    ? "cursor-not-allowed opacity-55"
                    : "hover:border-accent hover:bg-workspace",
                )}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-workspace text-ink">
                  <BlockIcon name={block.icon} />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-ink">{block.name}</span>
                  {block.premium ? (
                    <span className="rounded bg-accent/15 px-1 py-0.5 text-[10px] font-semibold text-accent">
                      PRO
                    </span>
                  ) : null}
                </span>
                <span className="line-clamp-2 text-xs text-ink-secondary">
                  {disabled ? "Coming soon" : block.description}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-ink text-white"
          : "bg-workspace text-ink-secondary hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
