import type { EditorBlock, PageRecord, PublishedSnapshot } from "@/types/product";

export function createPublishedSnapshot(page: PageRecord, blocks: EditorBlock[]): PublishedSnapshot {
  return {
    page: {
      id: page.id,
      workspace_id: page.workspace_id,
      title: page.title,
      slug: page.slug,
      draft_design: page.draft_design,
    },
    blocks: blocks
      .filter((block) => block.is_visible)
      .sort((a, b) => a.position - b.position),
    publishedAt: new Date().toISOString(),
  };
}
