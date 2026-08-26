import { describe, it, expect } from "vitest";
import {
  BLOCK_REGISTRY,
  getBlockDefinition,
  isBlockReady,
  ALL_BLOCKS,
} from "@/lib/blocks/registry";
import { EDITOR_SCHEMA } from "@/lib/blocks/editor-schema";

describe("block registry", () => {
  it("has a definition for every registry key", () => {
    for (const [key, def] of Object.entries(BLOCK_REGISTRY)) {
      expect(def.type).toBe(key);
      expect(def.name.length).toBeGreaterThan(0);
      expect(def.category).toBeTruthy();
    }
  });

  it("resolves and reports readiness", () => {
    expect(getBlockDefinition("heading")?.name).toBe("Heading");
    expect(isBlockReady("heading")).toBe(true);
    expect(isBlockReady("payment")).toBe(false); // coming soon
    expect(getBlockDefinition("does-not-exist")).toBeUndefined();
  });

  it("every ready non-trivial block has an editor schema", () => {
    const noSchemaNeeded = new Set(["divider"]);
    for (const block of ALL_BLOCKS) {
      if (block.status !== "ready") continue;
      if (noSchemaNeeded.has(block.type)) continue;
      expect(EDITOR_SCHEMA[block.type], `missing schema for ${block.type}`).toBeDefined();
    }
  });
});
