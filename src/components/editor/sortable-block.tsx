"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
} from "lucide-react";
import type { EditorBlock } from "@/lib/blocks/types";
import { BlockView } from "@/components/blocks/block-renderer";
import { cn } from "@/lib/utils";

interface Props {
  block: EditorBlock;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleVisible: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SortableBlock({
  block,
  isFirst,
  isLast,
  onEdit,
  onDuplicate,
  onToggleVisible,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/block relative rounded-lg",
        !block.is_visible && "opacity-55",
      )}
    >
      {/* Hover outline + click-to-edit surface */}
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit block"
        className="absolute inset-0 z-0 rounded-lg ring-inset ring-accent/0 transition-[box-shadow] group-hover/block:ring-2 group-hover/block:ring-accent/40"
      />

      {/* Left drag handle */}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="absolute -left-8 top-1/2 z-10 hidden -translate-y-1/2 cursor-grab rounded-md bg-surface p-1 text-ink-secondary shadow-sm hover:text-ink group-hover/block:block active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      {/* Right action rail */}
      <div className="absolute -right-9 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-0.5 rounded-md bg-surface p-0.5 shadow-sm group-hover/block:flex">
        <IconBtn label="Move up" disabled={isFirst} onClick={onMoveUp}>
          <ChevronUp className="size-3.5" />
        </IconBtn>
        <IconBtn label="Move down" disabled={isLast} onClick={onMoveDown}>
          <ChevronDown className="size-3.5" />
        </IconBtn>
        <IconBtn label="Edit" onClick={onEdit}>
          <Pencil className="size-3.5" />
        </IconBtn>
        <IconBtn label="Duplicate" onClick={onDuplicate}>
          <Copy className="size-3.5" />
        </IconBtn>
        <IconBtn
          label={block.is_visible ? "Hide" : "Show"}
          onClick={onToggleVisible}
        >
          {block.is_visible ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </IconBtn>
        <IconBtn label="Delete" destructive onClick={onDelete}>
          <Trash2 className="size-3.5" />
        </IconBtn>
      </div>

      <div className="pointer-events-none relative z-[1]">
        <BlockView block={block} ctx={{ interactive: false }} />
      </div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  destructive,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded p-1 transition-colors hover:bg-workspace disabled:opacity-30",
        destructive ? "text-danger" : "text-ink-secondary hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
