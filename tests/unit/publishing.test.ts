import { describe, expect, it } from "vitest";
import { createPublishedSnapshot } from "@/lib/publishing";
import { defaultDesign } from "@/lib/product-data";
import type { EditorBlock, PageRecord } from "@/types/product";

describe("publishing", () => {
  it("publishes only visible blocks in persisted order", () => {
    const page = {
      id: "page",
      workspace_id: "workspace",
      title: "Menu",
      slug: "menu",
      status: "draft",
      draft_design: defaultDesign,
      published_snapshot: null,
      published_at: null,
      updated_at: new Date().toISOString(),
    } satisfies PageRecord;
    const base = {
      page_id: "page",
      workspace_id: "workspace",
      design: {},
      scheduled_from: null,
      scheduled_until: null,
      created_at: "",
      updated_at: "",
    };
    const blocks = [
      { ...base, id: "b", type: "text", position: 2, content: {}, is_visible: true },
      { ...base, id: "a", type: "heading", position: 1, content: {}, is_visible: true },
      { ...base, id: "hidden", type: "text", position: 0, content: {}, is_visible: false },
    ] satisfies EditorBlock[];

    expect(createPublishedSnapshot(page, blocks).blocks.map((block) => block.id)).toEqual(["a", "b"]);
  });
});
