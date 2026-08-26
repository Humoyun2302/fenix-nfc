"use client";

import type { CSSProperties } from "react";
import type { EditorBlock } from "@/lib/blocks/types";
import { resolveDesign, type PageDesign } from "@/lib/design/theme";
import type { Json } from "@/types/database";
import { BlockView, type RenderContext } from "./block-renderer";
import { cn } from "@/lib/utils";

interface PageCanvasProps {
  blocks: EditorBlock[];
  design: PageDesign;
  themeConfig: Json | null;
  ctx: RenderContext;
  className?: string;
}

/** Renders the full stack of visible blocks with the page's resolved theme. */
export function PageCanvas({
  blocks,
  design,
  themeConfig,
  ctx,
  className,
}: PageCanvasProps) {
  const resolved = resolveDesign(themeConfig, design);
  const visible = [...blocks]
    .filter((b) => b.is_visible)
    .sort((a, b) => a.position - b.position);

  return (
    <div
      className={cn("min-h-full w-full", className)}
      style={{ ...resolved.backgroundStyle, ...(resolved.vars as CSSProperties) }}
    >
      <div
        className="mx-auto flex w-full flex-col px-4 py-6"
        style={{
          maxWidth: resolved.contentWidth,
          gap: "var(--block-gap)",
          color: "var(--page-text)",
        }}
      >
        {visible.map((block) => (
          <div key={block.id} style={blockOverrideStyle(block)}>
            <BlockView block={block} ctx={ctx} />
          </div>
        ))}
      </div>
    </div>
  );
}

function blockOverrideStyle(block: EditorBlock): CSSProperties {
  const d = block.design ?? {};
  const style: CSSProperties = {};
  if (d.align) style.textAlign = d.align;
  if (d.background) style.background = d.background;
  if (d.textColor) style.color = d.textColor;
  if (d.padding != null) style.padding = d.padding;
  if (d.margin != null) style.margin = d.margin;
  if (d.radius != null) style.borderRadius = d.radius;
  return style;
}
