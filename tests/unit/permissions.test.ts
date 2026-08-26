import { describe, it, expect } from "vitest";
import { can, canEdit, canManage, isOwner } from "@/lib/permissions/roles";

describe("permissions", () => {
  it("owner has full access", () => {
    expect(isOwner("owner")).toBe(true);
    expect(canManage("owner")).toBe(true);
    expect(canEdit("owner")).toBe(true);
    expect(can("owner", "billing.manage")).toBe(true);
    expect(can("owner", "workspace.delete")).toBe(true);
  });

  it("admin manages but cannot access billing or delete workspace", () => {
    expect(canManage("admin")).toBe(true);
    expect(can("admin", "members.manage")).toBe(true);
    expect(can("admin", "billing.manage")).toBe(false);
    expect(can("admin", "workspace.delete")).toBe(false);
  });

  it("editor edits but cannot manage members", () => {
    expect(canEdit("editor")).toBe(true);
    expect(canManage("editor")).toBe(false);
    expect(can("editor", "pages.edit")).toBe(true);
    expect(can("editor", "members.manage")).toBe(false);
  });

  it("viewer can only view", () => {
    expect(canEdit("viewer")).toBe(false);
    expect(can("viewer", "analytics.view")).toBe(true);
    expect(can("viewer", "pages.edit")).toBe(false);
  });

  it("null role has no access", () => {
    expect(canEdit(null)).toBe(false);
    expect(canManage(undefined)).toBe(false);
    expect(can(null, "analytics.view")).toBe(false);
  });
});
