import { describe, expect, it } from "vitest";
import { can } from "@/lib/permissions";

describe("workspace permissions", () => {
  it("allows editors to edit but not manage billing", () => {
    expect(can("editor", "edit_blocks")).toBe(true);
    expect(can("editor", "manage_billing")).toBe(false);
  });

  it("keeps owner-only actions owner-only", () => {
    expect(can("administrator", "delete_workspace")).toBe(false);
    expect(can("owner", "delete_workspace")).toBe(true);
  });
});
